const express = require('express');
const http = require('http');
const path = require('path');
const got = require('got');

const db = require("./database/database_interface.js")
const wei_divider = 1000000000000000000;

const app = express();
const server = http.createServer(app);
app.use(express.static('public'));
// Server port
const HTTP_PORT = 8000
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
        const prices = await got('https://explorer.thetatoken.org:9000/api/price/all');
        const tfuel_price = JSON.parse(prices.body).body[0]['price'];
        const theta_price = JSON.parse(prices.body).body[1]['price'];

        // get theta holding
        const holding = await got(`https://explorer.thetatoken.org:9000/api/account/${wallet_adr}`);
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
        const staked_query = await got(`https://explorer.thetatoken.org:9000/api/stake/${wallet_adr}`);
        response.push(...JSON.parse(staked_query.body).body.sourceRecords.map((x) => {
            return {
                "amount": x["amount"] / wei_divider,
                "type": "guardian",
                "value": x["amount"] / wei_divider * theta_price,
                "market_price": 0,
                "wallet_address": x["source"],
                "node_address": x["holder"],
                "currency": "theta"
            }
        }));

        res.json(response)
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// guardian node infos

app.get('/guardian/status', async (req, res) => {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
        const {stdout, stderr} = await exec("~/bin/thetacli query status");
        if (stderr) {
            res.json({"status": "error", "msg": stderr})
        } else {
            const status = JSON.parse(stdout);
            if (status["syncing"]) {
                res.json({"status": "syncing", "msg": status})
            } else {
                res.json({"status": "ready", "msg": status})
            }
        }
    } catch (e) {
        res.json({"status": "error", "msg": e})
    }
})


// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});


