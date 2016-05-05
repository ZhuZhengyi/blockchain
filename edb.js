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
var pipe = new erisContracts.pipes.DevPipe(erisdb, accountData.advchain_full_000);
pipe.addAccount(accountData.advchain_validator_000);
pipe.addAccount(accountData.advchain_participant_000);
// pipe.setDefaultAccount(accountData.advchain_participant_000.address);
var chain = erisdb.blockchain();
var account = erisdb.accounts();
var transaction = erisdb.txs();
var contractManager = erisContracts.newContractManager(pipe);
var contractData = require('./epm.json');
var address = contractData["deployPurchase"];
// var address = contractData["defaultAddr"];
var fs = require('fs');
var abi = JSON.parse(fs.readFileSync("./abi/" + address));
var myExistingContract;
contractManager.newContractFactory(abi).at(address, function (err, contract) {
    if (err) {throw err;}
    console.log("New Contract.");
    myExistingContract = contract;
})

function init(price){
    myExistingContract.init(price,function(err, res){
        if(err) {
            console.log(err);
            throw err;
        }
        // console.log(res);
    });
}

function sendTransaction(from, value){
    var to = contractData["defaultAddr"];
    // var to = contract.address;
    transaction.call(from, to, value.toString(16), function(err, res){
        if(err) {throw err;}
        console.log(res);
    });
}

function getInfo() {
    chain.getInfo(function (err, res) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(res);
    })
}

function getStorage() {
    account.getStorage(contractData["defaultAddr"],
        function (err, res) {
            if (err) {
                throw err;
            }
            console.log(res);
        }
    );
}

function getAccount(addr){
    account.getAccount(addr, function(err, res){
        if (err) {
            console.log(err)
            throw err;
        }
        console.log(typeof(res))
        console.log(res);
    });
}
//{from: accountData.advchain_participant_000.address},
function confirm(){
    myExistingContract.confirmPurchase({amount: 500},function(err, res){
        if(err) {
            console.log(err);
            throw err;
        }
        console.log(res);
    });
    console.log("Confirm Purchase");
}

function confirmReceived(){
    myExistingContract.confirmReceived(function(err, res){
        if(err) {
            console.log(err);
            throw err;
        }
        console.log(res);
    });
    console.log("Confirm Received");
}
var fromA = accountData.advchain_full_000.address;
var fromB = accountData.advchain_validator_000.address;
// sendTransaction(fromB, 100);
init(350);
confirm();
confirmReceived();
// getAccount(fromA)
// getAccount(fromB)
// getStorage();
// getInfo();