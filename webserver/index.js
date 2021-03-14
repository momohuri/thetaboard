const express = require('express');
const http = require('http');
const path = require('path');
const got = require('got');

const db = require("./database/database_interface.js")


const app = express();
const server = http.createServer(app);
app.use(express.static('public'));
// Server port
const HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
// Root endpoint
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});


// Root endpoint
app.get("/wallet-info/:wallet_addr", async (req, res, next) => {
    const wallet_adr = req.params.wallet_addr;
    const response = {
        "staked_theta": null,
        "balances": null,
    }
    try {
        // get staked theta
        const staked_query = await got(`https://explorer.thetatoken.org:9000/api/stake/${wallet_adr}`);
        response['staked_theta'] = JSON.parse(staked_query.body).body.sourceRecords;
        // get theta holding
        const holding = await got(`https://explorer.thetatoken.org:9000/api/account/${wallet_adr}`);
        response['balances'] = JSON.parse(holding.body).body.balance;
        res.json(response)
    } catch (error) {
        res.status(400).send(error.message);
    }
});


// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});


