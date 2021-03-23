const express = require('express');
const http = require('http');
const path = require('path');
const got = require('got');
const dateFormat = require("dateformat");
const wei_divider = 1000000000000000000;
let theta_explorer_api_domain = "https://explorer.thetatoken.org:9000";
const app = express();
//Create Router
var router = express.Router()
//Create Server
const server = http.createServer(app);
app.use(express.static('public'));
// Server port
const HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
// Endpoint for ember files
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// a middleware function with no mount path. This code is executed for every request to the router
app.use(function (req, res, next) {
    if (req.query && req.query.env) {
        if (req.query.env == 'testnet') {
            theta_explorer_api_domain = "https://guardian-testnet-explorer.thetatoken.org:9000";
        } else if (req.query.env == 'smart-contracts'){
            theta_explorer_api_domain = "https://smart-contracts-sandbox-explorer.thetatoken.org:9000";
        }
    } else {
        theta_explorer_api_domain = "https://explorer.thetatoken.org:9000";
    }
    next()
})

// wallet infos
app.get("/wallet-info/:wallet_addr", async (req, res, next) => {
    const wallet_adr = req.params.wallet_addr;

    // balances should be of hte following format:
    // {
    //     amount: 0,
    //     currency: "theta/tfuel",
    //     value: 0, // value in $$$
    //     type: "wallet/guardian/edge",
    //     wallet_address: "0x000" // theta address
    //     reward_address: "0x000" // theta address if staked tfuel/theta
    // }

    const response = [];
    try {
        // get price
        const prices = await got(`${theta_explorer_api_domain}/api/price/all`, {https: {rejectUnauthorized: false}});
        const tfuel_price = JSON.parse(prices.body).body[0]['price'];
        const theta_price = JSON.parse(prices.body).body[1]['price'];
        // get theta holding
        const holding = await got(`${theta_explorer_api_domain}/api/account/${wallet_adr}`, {https: {rejectUnauthorized: false}});
        const balances = JSON.parse(holding.body).body.balance;
        response.push({
            "amount": balances['thetawei'] / wei_divider,
            "type": "wallet",
            "value": balances['thetawei'] / wei_divider * theta_price,
            "market_price": theta_price,
            "wallet_address": wallet_adr,
            "node_address": null,
            "currency": "theta"
        });
        response.push({
            "amount": balances['tfuelwei'] / wei_divider,
            "type": "wallet",
            "value": balances['tfuelwei'] / wei_divider * tfuel_price,
            "market_price": tfuel_price,
            "wallet_address": wallet_adr,
            "node_address": null,
            "currency": "tfuel"
        });

        // get staked theta
        const staked_query = await got(`${theta_explorer_api_domain}/api/stake/${wallet_adr}`, {https: {rejectUnauthorized: false}});
        response.push(...JSON.parse(staked_query.body).body.sourceRecords.map((x) => {
            return {
                "amount": x["amount"] / wei_divider,
                "type": "guardian",
                "value": x["amount"] / wei_divider * theta_price,
                "market_price": theta_price,
                "wallet_address": x["source"],
                "node_address": x["holder"],
                "currency": "theta"
            }
        }));

        // get transaction history
        const transaction_history = [];
        const transaction_history_query = await got(`${theta_explorer_api_domain}/api/accounttx/${wallet_adr}?type=-1&pageNumber=1&limitNumber=20&isEqualType=false`,
            {https: {rejectUnauthorized: false}});

        transaction_history.push(...JSON.parse(transaction_history_query.body).body.map((x) => {
            const input = x["data"].inputs ? x["data"]["inputs"][0] : x["data"]["proposer"];
            if (x["type"] == 0) {
                let output = x["data"]["outputs"].filter(x => x['address'] === wallet_adr)[0];
                x["data"]["outputs"] = [output];
            }

            
            return {
                "in_or_out": wallet_adr.toUpperCase() == input["address"].toUpperCase() ? "out" : "in",
                "type": x["type"],
                "txn_hash": x["hash"],
                "block": x["block_height"],
                "timestamp": dateFormat(new Date(Number(x["timestamp"]) * 1000), "isoDateTime"),
                "status": x["status"],
                "from_wallet_address": input["address"],
                "to_wallet_address": x["data"]["outputs"][0]["address"],
                "value": [{
                    "type": "theta",
                    "amount": x["data"]["outputs"][0]["coins"]["thetawei"] / wei_divider,
                    "value": x["data"]["outputs"][0]["coins"]["thetawei"] / wei_divider * theta_price
                }, {
                    "type": "tfuel",
                    "amount": x["data"]["outputs"][0]["coins"]["tfuelwei"] / wei_divider,
                    "value": x["data"]["outputs"][0]["coins"]["tfuelwei"] / wei_divider * tfuel_price
                }
                ]
            }
        }));

        res.json({wallet: response, transactions: transaction_history})
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// guardian node APIs
const fs = require('fs');
const os = require("os");
const find = require('find-process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const rfs = require("rotating-file-stream");
const await_spawn = require('await-spawn');

// set machine id as password of GN so it persists after docker restart.
const theta_mainnet_folder = "/home/node/theta_mainnet";
const guardian_password = "NODE_PASSWORD" in process.env && process.env.NODE_PASSWORD ? process.env.NODE_PASSWORD : "MY_SECRET_NODE_PASSWORD";
app.get('/guardian/status', async (req, res) => {
    try {
        const {stdout, stderr} = await exec(`${theta_mainnet_folder}/bin/thetacli query status`);

        if (stderr) {
            res.json({"status": "error", "msg": stderr});
        } else {
            const status = JSON.parse(stdout);
            if (status["syncing"]) {
                res.json({"status": "syncing", "msg": status});
            } else {
                res.json({"status": "ready", "msg": status});
            }
        }
    } catch (e) {
        try {
            const theta_process = await find('name', `${theta_mainnet_folder}/bin/theta`);
            if (theta_process.length > 0) {
                res.json({"status": "syncing", "msg": "process up"});
            } else {
                res.json({"status": "error", "msg": e});
            }
        } catch (e) {
            res.json({"status": "error", "msg": e});
        }
    }
});

app.get('/guardian/start', async (req, res) => {
    try {
        const theta_process = await find('name', `${theta_mainnet_folder}/bin/theta`);
        if (theta_process.length > 0) {
            res.json({"error": "Process already started", "success": false});
        } else if (os.totalmem() < 4175540224) {
            res.json({"error": "Need at least 4GB of ram", "success": false});
        } else {
            // TODO: test if snapshot file exists or not. Download if needed
            const logStream = rfs.createStream("./guardian_logs.log", {
                size: "1M", // rotate every 1 MegaBytes written
                interval: "1d", // rotate daily
                maxFiles: 10,
                path: "logs"

            });
            const job = spawn(`${theta_mainnet_folder}/bin/theta`,
                ["start", `--config=${theta_mainnet_folder}/guardian_mainnet/node`, `--password=${guardian_password}`],
                {
                    detached: true,// can't run the process detached because of the logs streaming

                })
            job.stdout.pipe(logStream);
            job.stderr.pipe(logStream);
            job.on('error', (error) => {
                console.log(error);
            });
            res.json({"error": null, "success": true});
        }
    } catch (e) {
        res.json({"error": e, "success": false});
    }
});

app.get('/guardian/stop', async (req, res) => {
    try {
        const theta_process = await find('name', `${theta_mainnet_folder}/bin/theta`);
        if (theta_process.length === 0) {
            res.json({"error": "No process found", "success": false});
        } else {
            theta_process.map((x) => {
                process.kill(x['pid']);
            });
            res.json({"error": null, "success": true});

        }
    } catch (e) {
        res.json({"error": e, "success": false});
    }
});

app.get('/guardian/logs', (req, res) => {
    const readStream = fs.createReadStream('./logs/guardian_logs.log');
    readStream.on("error", () => {
        res.send("No logs")
    });
    readStream.pipe(res);
});

app.get('/guardian/summary', async (req, res) => {
    let version = null;
    try {
        version = await exec(`${theta_mainnet_folder}/bin/theta version`);
    } catch (e) {
    }

    try {
        const {stdout, stderr} = await exec(`${theta_mainnet_folder}/bin/thetacli query guardian`);
        if (stderr) {
            res.json({"success": false, "msg": stderr, "version": version});
        } else {
            const summary = JSON.parse(stdout);
            res.json({"success": true, "msg": summary, "version": version});
        }
    } catch (e) {
        res.json({"success": false, "msg": e, "version": version});
    }
});

app.get('/guardian/update', async (req, res) => {
    try {
        fs.rmSync(`${theta_mainnet_folder}/bin/theta`, {'force': true});
        fs.rmSync(`${theta_mainnet_folder}/bin/thetacli`, {'force': true});
        // get latest urls
        const config = await got(`https://mainnet-data.thetatoken.org/config?is_guardian=true`, {https: {rejectUnauthorized: false}});
        const theta = await got(`https://mainnet-data.thetatoken.org/binary?os=linux&name=theta`, {https: {rejectUnauthorized: false}});
        const thetacli = await got(`https://mainnet-data.thetatoken.org/binary?os=linux&name=theta`, {https: {rejectUnauthorized: false}});
        // DLL files
        const wget_config = await_spawn(`wget`, [`--no-check-certificate`, `-O`, `${theta_mainnet_folder}/guardian_mainnet/node/config.yaml`, config.body]);
        const wget_theta = await_spawn(`wget`, [`--no-check-certificate`, `-O`, `${theta_mainnet_folder}/bin/theta`, theta.body]);
        const wget_thetacli = await_spawn(`wget`, [`--no-check-certificate`, `-O`, `${theta_mainnet_folder}/bin/thetacli`, thetacli.body]);
        // put correct auth
        await_spawn(`chmod`, [`+x`, `${theta_mainnet_folder}/bin/thetacli`]);
        await_spawn(`chmod`, [`+x`, `${theta_mainnet_folder}/bin/theta`]);
        res.json({"error": null, "success": true});
    } catch (e) {
        res.json({"error": e, "success": false});
    }
});

app.get('/guardian/download_snapshot', async (req, res) => {
    try {
        const theta_process = await find('name', `${theta_mainnet_folder}/bin/theta`);
        if (theta_process.length > 0) {
            res.json({"msg": "Process is running", "success": false});
        } else {
            fs.rmdirSync(`${theta_mainnet_folder}/guardian_mainnet/node/key`, {recursive: true});
            fs.rmdirSync(`${theta_mainnet_folder}/guardian_mainnet/node/db`, {recursive: true});
            fs.rmSync(`${theta_mainnet_folder}/guardian_mainnet/node/snapshot`, {'force': true});
            const snapshot_url = await got(`https://mainnet-data.thetatoken.org/snapshot`, {https: {rejectUnauthorized: false}});
            const wget = spawn(`wget`, [`--no-check-certificate`, `-O`, `${theta_mainnet_folder}/guardian_mainnet/node/snapshot`, snapshot_url.body]);
            wget.stdout.pipe(res);
            wget.stderr.pipe(res);
        }
    } catch (e) {
        res.json({"msg": e, "success": false});
    }

});

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});


