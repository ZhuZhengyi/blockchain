contract iotManager{
    address seller;
    // This holds a reference to the current purchase contract.
    address pAddr;
    mapping (address => uint) buyerBalance;
    mapping (address => string) buyerResult;
    uint prepaidValue;
    modifier onlySeller() {
        if (msg.sender != seller) throw;
        _
    }
    function iotManager{
        seller = msg.sender;
        pAddr = new Purchase();
    }
    function setPrepaid() {
        prepaidValue = msg.value;
        Purchase(pAddr).setPrepaid.value(msg.value)(msg.sender);
    }
    // Use the interface to call on the Purchase contract. We pass msg.value along as well.
    function prepaid() returns (bool result){
        if (msg.value == 0){
            return false;
        }
        if (pAddr == 0x0 ) {
            //If the user sent money, we should return it if we can't prepaid.
            msg.sender.send(msg.value);
            return false;
        }
        if(msg.value < prepaidValue){
            return false;
        }
        bool success = Purchase(pAddr).prepaid.value(msg.value);
        // If the transaction failed, return money to the caller.
        if (!success) {
            msg.sender.send(msg.value);
        }
        buyerBalance[msg.sender] = msg.value;
        return success;
    }
    function getBalance(address client) returns (uint blnc){
        uint blnc = Purchase(pAddr).getBalance();
    }
    function checkPrepaid(address client) onlySeller returns (bool result){
        if(buyerBalance[client] <= prepaidValue){
            return false;
        }
        uint balanceInP = Purchase(pAddr). getBalance();
        if(buyerBalance[client] != balanceInP){
            return false;
        }
        return true;
    }
    function deduct(address buyer, uint price) onlySeller returns (bool res){
        if(buyerBalance[buyer] < price){
            return false;
        }
        uint newBuyerBalance = Purchase(pAddr).deduct(price);
        buyerBalance[buyer] = newBuyerBalance;
        return true;
    }
    function refund(address buyer) onlySeller returns (bool result){
        if (pAddr == 0x0 ) {
            return false;
        }
        bool success = Purchase(pAddr).refund();
        if(!success){
            return false;
        }
        buyer.send(buyerBalance[buyer]);
        return success;
    }
    function getAddr() onlySellcer constant returns (address addr){
        return pAddr;
    }
    function setAddr(address newAddr) onlySeller returns (bool result){
        pAddr = newAddr;
    }
    function setResult(address buyer, string result) onlySeller returns (bool res){
        if(buyerBalance[msg.sender] == 0){
            return false;
        }
        buyerResult[buyer] = result;
        return true;
    }
    function getResult() returns (string res){
        return buyerResult[msg.sender];
    }
}