const express = require('express');
const http = require('http');
const path = require('path');
const got = require('got');
const expressStaticGzip = require("express-static-gzip");
const dateFormat = require("dateformat");

const wei_divider = 1000000000000000000;
let theta_explorer_api_domain = "https://explorer.thetatoken.org:8443";
const app = express();
const router = express.Router();
const server = http.createServer(app);

app.use('/', expressStaticGzip('public'));
// Server port
const HTTP_PORT = process.env.PORT || 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// env variables
const api_token = "API_TOKEN" in process.env && process.env.API_TOKEN ? process.env.API_TOKEN : null;
const guardian_password = "NODE_PASSWORD" in process.env && process.env.NODE_PASSWORD ? process.env.NODE_PASSWORD : "MY_SECRET_NODE_PASSWORD";
const is_public = "PUBLIC" in process.env && process.env.PUBLIC;
const theta_explorer_api_params = {
    https: {rejectUnauthorized: false},
}
if (api_token) {
    theta_explorer_api_params.headers = {"x-api-token": api_token}
}

// a middleware function with no mount path. This code is executed for every request to the router
app.use(function (req, res, next) {
    if (req.query && req.query.env) {
        if (req.query.env === 'testnet') {
            theta_explorer_api_domain = "https://guardian-testnet-explorer.thetatoken.org:8443";
        } else if (req.query.env === 'smart-contracts') {
            theta_explorer_api_domain = "https://smart-contracts-sandbox-explorer.thetatoken.org:8443";
        }
    } else {
        theta_explorer_api_domain = "https://explorer.thetatoken.org:8443";
    }
    next();
});


// isPublic
app.get("/is-public", async (req, res, next) => {
    try {
        res.json({success: true, is_public: is_public});
    } catch (error) {
        res.status(400).json(error.response.body);
    }
});

// Explorer Info
app.get("/explorer/prices", async (req, res, next) => {
    try {
        // get prices
        const prices = await got(`${theta_explorer_api_domain}/api/price/all`, theta_explorer_api_params);
        const tfuel_price = JSON.parse(prices.body).body.filter(x => x['_id'] === 'TFUEL')[0];
        const theta_price = JSON.parse(prices.body).body.filter(x => x['_id'] === 'THETA')[0];
        res.json({
            theta: theta_price,
            tfuel: tfuel_price,
        });
    } catch (error) {
        res.status(400).json(error.response.body);
    }
});

app.get("/explorer/totalStake", async (req, res, next) => {
    try {
        // get stake
        const stake = await got(`${theta_explorer_api_domain}/api/stake/totalAmount`, theta_explorer_api_params);
        res.json(JSON.parse(stake.body).body);
    } catch (error) {
        res.status(400).json(error.response.body);
    }
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
        const prices = await got(`${theta_explorer_api_domain}/api/price/all`, theta_explorer_api_params);
        const tfuel_price = JSON.parse(prices.body).body.filter(x => x['_id'] === 'TFUEL')[0]['price'];
        const theta_price = JSON.parse(prices.body).body.filter(x => x['_id'] === 'THETA')[0]['price'];
        // get theta holding
        const holding = await got(`${theta_explorer_api_domain}/api/account/${wallet_adr}`, theta_explorer_api_params);

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
        const staked_query = await got(`${theta_explorer_api_domain}/api/stake/${wallet_adr}`, theta_explorer_api_params);
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

        res.json({wallets: response})
    } catch (error) {
        res.status(400).json(error.response.body);
    }
});

// wallet transactions
app.get("/wallet-transactions/:wallet_addr", async (req, res, next) => {
    const wallet_adr = req.params.wallet_addr;

    try {
        // get price
        const prices = await got(`${theta_explorer_api_domain}/api/price/all`, theta_explorer_api_params);
        const tfuel_price = JSON.parse(prices.body).body.filter(x => x['_id'] === 'TFUEL')[0]['price'];
        const theta_price = JSON.parse(prices.body).body.filter(x => x['_id'] === 'THETA')[0]['price'];

        // get transaction history
        const transaction_history = [];
        const pageNumber = req.query.pageNumber ? req.query.pageNumber.toString() : '1';
        const limitNumber = req.query.limitNumber ? req.query.limitNumber.toString() : '15';
        const transaction_history_query = await got(`${theta_explorer_api_domain}/api/accounttx/${wallet_adr}?type=-1&pageNumber=${pageNumber}&limitNumber=${limitNumber}&isEqualType=false`,
            theta_explorer_api_params);
        const transaction_list = JSON.parse(transaction_history_query.body);
        const pagination = {
            currentPageNumber: transaction_list.currentPageNumber,
            totalPageNumber: transaction_list.totalPageNumber
        };
        transaction_history.push(...transaction_list.body.map((x) => {
            let from, to, values, typeName = null;
            if (x["type"] == 0) {
                from = x["data"]["proposer"];
                to = x["data"]["outputs"].filter(x => x['address'].toUpperCase() === wallet_adr.toUpperCase())[0];
                values = to;
                typeName = "Coinbase";
            } else if (x["type"] == 10) {
                from = x["data"]["source"];
                to = x["data"]["holder"];
                values = from;
                typeName = "Deposit Stake";
            } else if (x["type"] == 2) {
                from = x["data"]["inputs"][0];
                if (x["data"]["outputs"].length == 1) {
                    to = x["data"]["outputs"][0];
                } else {
                    to = x["data"]["outputs"].filter(x => x['address'].toUpperCase() === wallet_adr.toUpperCase())[0];
                }
                values = to;
                typeName = "Transfer";
            } else if (x["type"] == 9) {
                to = x["data"]["source"];
                from = x["data"]["holder"];
                values = to;
                typeName = "Withdraw Stake";
            } else if (x["type"] == 7) {
                from = x["data"]["from"];
                to = x["data"]["to"];
                values = to;
                typeName = "Smart Contract";
            } else {
                toto = 1;
            }

            return {
                "in_or_out": wallet_adr.toUpperCase() == from["address"].toUpperCase() ? "out" : "in",
                "type": x["type"],
                "typeName": typeName,
                "txn_hash": x["hash"],
                "block": x["block_height"],
                "timestamp": dateFormat(new Date(Number(x["timestamp"]) * 1000), "isoDateTime"),
                "status": x["status"],
                "from_wallet_address": from["address"],
                "to_wallet_address": to["address"],
                "value": [{
                    "type": "theta",
                    "amount": values["coins"]["thetawei"] / wei_divider,
                    "value": values["coins"]["thetawei"] / wei_divider * theta_price
                }, {
                    "type": "tfuel",
                    "amount": values["coins"]["tfuelwei"] / wei_divider,
                    "value": values["coins"]["tfuelwei"] / wei_divider * tfuel_price
                }
                ]
            }
        }));

        res.json({transactions: transaction_history, pagination: pagination})
    } catch (error) {
        res.status(400).json(error.response.body);
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

app.get('/guardian/status', async (req, res) => {
    let version = null;
    try {
        try {
            version = await exec(`${theta_mainnet_folder}/bin/theta version`);

            version = version.stdout.split('\n');
        } catch (e) {
        }

        const {stdout, stderr} = await exec(`${theta_mainnet_folder}/bin/thetacli query status`);

        const theta_process_pid = await find('name', `${theta_mainnet_folder}/bin/theta`);
        const theta_process_uptime = await exec(`ps -p ${theta_process_pid[0].pid} -o etimes`);
        const uptime = Number(theta_process_uptime.stdout.split('\n')[1]);

        if (stderr) {
            res.json({"status": "error", "msg": stderr, "uptime": uptime});
        } else {
            const status = JSON.parse(stdout);
            if (status["syncing"]) {
                res.json({
                    "status": "syncing",
                    "msg": status,
                    "version": version,
                    "uptime": uptime
                });
            } else {
                res.json({"status": "ready", "msg": status, "version": version, "uptime": uptime});
            }
        }
    } catch (e) {
        try {
            const theta_process = await find('name', `${theta_mainnet_folder}/bin/theta`);
            if (theta_process.length > 0) {
                const theta_process_pid = await find('name', `${theta_mainnet_folder}/bin/theta`);
                const theta_process_uptime = await exec(`ps -p ${theta_process_pid[0].pid} -o etimes`);
                const uptime = Number(theta_process_uptime.stdout.split('\n')[1]);
                res.json({
                    "status": "syncing",
                    "msg": {"process": "process up"},
                    "version": version,
                    "uptime": uptime
                });
            } else {
                res.json({"status": "error", "msg": e, "version": version, "uptime": 0});
            }
        } catch (e) {
            res.json({"status": "error", "msg": e, "version": version, "uptime": 0});
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
    if (is_public) {
        return res.json({"error": "Not Authorized", "success": false});
    }
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
        const body = "No logs";
        res.set('Content-Length', Buffer.byteLength(body));
        res.send(body);
    });
    readStream.pipe(res);
});

app.get('/guardian/summary', async (req, res) => {
    try {
        const {stdout, stderr} = await exec(`${theta_mainnet_folder}/bin/thetacli query guardian`);
        if (stderr) {
            res.json({"success": false, "msg": stderr});
        } else {
            const summary = JSON.parse(stdout);
            res.json({"success": true, "msg": summary});
        }
    } catch (e) {
        res.json({"success": false, "msg": e});
    }
});

app.get('/guardian/update', async (req, res) => {
    if (is_public) {
        return res.json({"error": "Not Authorized", "success": false});
    }
    try {
        fs.rmSync(`${theta_mainnet_folder}/bin/theta`, {'force': true});
        fs.rmSync(`${theta_mainnet_folder}/bin/thetacli`, {'force': true});
        // get latest urls
        const config = await got(`https://mainnet-data.thetatoken.org/config?is_guardian=true`, {https: {rejectUnauthorized: false}});
        const theta = await got(`https://mainnet-data.thetatoken.org/binary?os=linux&name=theta`, {https: {rejectUnauthorized: false}});
        const thetacli = await got(`https://mainnet-data.thetatoken.org/binary?os=linux&name=thetacli`, {https: {rejectUnauthorized: false}});
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

app.get('/guardian/latest_snapshot', async (req, res) => {
    if (is_public) {
        return res.json({"error": "Not Authorized", "success": false});
    }
    try {
        const {birthtime} = fs.statSync(`${theta_mainnet_folder}/guardian_mainnet/node/snapshot`, {'force': true});
        res.json({"success": true, "date": birthtime})
    } catch (e) {
        res.json({"success": false, "error": e});
    }

})

app.get('/guardian/download_snapshot', async (req, res) => {
    if (is_public) {
        return res.json({"error": "Not Authorized", "success": false});
    }
    try {
        const theta_process = await find('name', `${theta_mainnet_folder}/bin/theta`);
        if (theta_process.length > 0) {
            res.json({"msg": "Process is running", "success": false});
        } else {
            fs.rmdirSync(`${theta_mainnet_folder}/guardian_mainnet/node/db`, {recursive: true});
            fs.rmSync(`${theta_mainnet_folder}/guardian_mainnet/node/snapshot`, {'force': true});
            const snapshot_url = await got(`https://mainnet-data.thetatoken.org/snapshot`, {https: {rejectUnauthorized: false}});

            const {
                stdout,
                stderr
            } = await exec(`wget ${snapshot_url.body} --spider --server-response 2>&1 | sed -n '/Content-Length/{s/.*: //;p}'`);
            const wget = spawn(`wget`, [`--no-check-certificate`, `-O`, `${theta_mainnet_folder}/guardian_mainnet/node/snapshot`, snapshot_url.body]);
            res.write(`{"Content-Length":${stdout.replace('\n', '')}}\n`)
            wget.stdout.pipe(res);
            wget.stderr.pipe(res);
        }
    } catch (e) {
        res.json({"msg": e, "success": false});
    }

});


// Default response for any other request
app.use(function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


