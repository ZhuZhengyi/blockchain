'use strict';

var
    erisC = require('eris-contracts'),
    contractData = require('./epm.json'),
    address = contractData["deployGSFactory"],
    fs = require('fs'),
    abi = JSON.parse(fs.readFileSync("./abi/" + address)),
    account = require('./accounts.json'),
    chainUrl = "http://140.119.19.230:1337/rpc",
    manager, gsFactoryContract;

// Instantiate the contract object manager using the chain URL and the account
// data.
manager = erisC.newContractManagerDev(chainUrl, account.advchain_full_000);
// Instantiate the contract object using the ABI and the address.
gsFactoryContract = manager.newContractFactory(abi).at(address);
function newContract(){
    gsFactoryContract.create(function(error, result){
        if (error) { throw error }
        console.log("new gsFactoryContract address:\t\t\t" + result);
    });
}


function getLast(){
    var last;
    gsFactoryContract.getLast(function(error, result){
        if (error) { throw error }
        console.log(result);
    });
    return last;
}

function set(value){
    gsFactoryContract.getLast(function(error, addr){
        if (error) { throw error }
        //addr of GSContract
        var contractAbi = JSON.parse(fs.readFileSync("./abi/" + addr));
        var contract = manager.newContractFactory(abi).at(address);
        contract.set(value, function(error, result){
            if (error) { throw error }
            console.log("Set: "+result);
        });
    });
}

function get(){
    gsFactoryContract.getLast(function(error, addr){
        if (error) { throw error }
        //addr of GSContract
        console.log("factory contract addr: " + addr);
        var contractAbi = JSON.parse(fs.readFileSync("./abi/" + addr));
        var contract = manager.newContractFactory(abi).at(address);
        contract.get(function(error, result){
            if (error) { throw error }
            console.log("Get Storage: "+result);
        });
    });
}

function testSet(){
    contract.setStorage
}


// establish a fake port to listen to....
var port = process.env.IDI_PORT

// note the number of times, defaulting to 5 to do the get -> set reduction
var times = parseInt(process.env.TIMES) || 5