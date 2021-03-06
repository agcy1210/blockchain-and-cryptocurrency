const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');


const HTTP_PORT = process.env.HTTP_PORT || 3001; 

const app = express();
const bc = new Blockchain();
const p2pServer = new P2pServer(bc);
const wallet = new Wallet();
const tp = new TransactionPool();


//body parser is used to recieve data from post request in a specific format
app.use(bodyParser.json());

app.get('/blocks', (req, res)=> {
    res.json(bc.chain);
});

app.post('/mine', (req, res) => {
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);

    p2pServer.syncChains();

    res.redirect('/blocks');
});

app.get('/transactions', (req,res) => {
    res.json(tp.transactions);
});

app.post('/transact', (req,res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, tp);
    res.redirect('/transactions');
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));

// this will start the websocket server in this blockchain app instance
p2pServer.listen();