const express = require('express');
const http = require('http');
const path = require('path');
const got = require('got');
const dateFormat = require("dateformat");
const wei_divider = 1000000000000000000;
/* smart sandbox
uncomment the process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'; line to avoid certificat error when using smart sandbox
NOT useful for Mainnet config
*/
const theta_explorer_api_domain = "https://smart-contracts-sandbox-explorer.thetatoken.org:9000";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//MAINNET
// const theta_explorer_api_domain = "https://explorer.thetatoken.org:9000"
const app = express();
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
        const prices = await got(`${theta_explorer_api_domain}/api/price/all`);
        const tfuel_price = JSON.parse(prices.body).body[0]['price'];
        const theta_price = JSON.parse(prices.body).body[1]['price'];
        // get theta holding
        const holding = await got(`${theta_explorer_api_domain}/api/account/${wallet_adr}`);
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
        const staked_query = await got(`${theta_explorer_api_domain}/api/stake/${wallet_adr}`);
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
        const transaction_history_query = await got(`${theta_explorer_api_domain}/api/accounttx/${wallet_adr}?type=5&pageNumber=1&limitNumber=50&isEqualType=true`);

        transaction_history.push(...JSON.parse(transaction_history_query.body).body.map((x) => {
            const input = x["data"].inputs ? x["data"]["inputs"][0] : x["data"]["proposer"];
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


// guardian node infos

const fs = require('fs');
const os = require("os");
const find = require('find-process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;
const rfs = require("rotating-file-stream");

// set machine id as password of GN so it persists after docker restart.
const theta_mainnet_folder = "/home/node/theta_mainnet"
const guardian_password = process.env.NODE_PASSWORD || "MY_SECRET_NODE_PASSWORD"
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
            const theta_process = await find('name', '/home/node/theta_mainnet/bin/theta');
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
        const theta_process = await find('name', '/home/node/theta_mainnet/bin/theta');
        if (theta_process.length > 0) {
            res.json({"error": "Process already started", "success": false});
        } else if (os.totalmem() < 4175540224) {
            res.json({"error": "Need at least 4GB of ram", "success": false});
        } else {
            const logStream = rfs.createStream("./guardian_logs.log", {
                size: "1M", // rotate every 1 MegaBytes written
                interval: "1d", // rotate daily
                maxFiles: 10,
                path: "logs"

            });
            const job = spawn(`${theta_mainnet_folder}/bin/theta`,
                ["start", `--config=${theta_mainnet_folder}/node`, `--password=${guardian_password}`],
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
        const theta_process = await find('name', '/home/node/theta_mainnet/bin/theta');
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

app.get('/guardian/update', async (req, res) => {
    //todo
});

app.get('/guardian/address', async (req, res) => {
    //todo
});

app.get('/guardian/restart_sync', async (req, res) => {
    //todo
});


// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});


