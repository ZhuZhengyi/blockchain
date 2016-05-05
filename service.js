/**
 * Created by WeiChen on 2016/5/3.
 */
'use strict'
// Get 'eris-contracts'.
var erisContracts = require('eris-contracts');
// Get 'eris-db' (the javascript API for eris-db)
var erisdbModule = require("eris-db");
// Create a new instance of ErisDB that uses the given URL.
var erisdb = erisdbModule.createInstance("http://140.119.19.234:1337/rpc");
// The private key.
var accountData = require('./accounts.json');
// Create a new pipe.
var pipe = new erisContracts.pipes.DevPipe(erisdb, accountData.iotchain_full_000);
pipe.addAccount(accountData.iotchain_validator_001);
pipe.addAccount(accountData.iotchain_validator_003);

var chain = erisdb.blockchain();
var account = erisdb.accounts();
var transaction = erisdb.txs();
var contractManager = erisContracts.newContractManager(pipe);
var contractData = require('./epm.json');
var address = contractData["deployContract"];
var fs = require('fs');
var abi = JSON.parse(fs.readFileSync("./abi/" + address));
var iotManager;
contractManager.newContractFactory(abi).at(address, function (err, contract) {
    if (err) {throw err;}
    console.log("New Contract: " + contract);
    iotManager = contract;
})

function setPrepay(price){
    iotManager.setPrepay(price, function(err, res){
        if(err) {
            console.log(err);
            throw err;
        }
        console.log("set prepay: " + res);
    });
}

function prepay(){
    iotManager.prepay({from: accountData.iotchain_validator_001.address, amount: 101, fee:1},function(err, res){
        if(err) {
            console.log(err);
            throw err;
        }
        console.log("Prepay: " + res);
    });
}

function getBalance(){
    iotManager.getBalance();
}