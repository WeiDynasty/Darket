contract MoonMarket {
    
    address public owner;
    mapping (bytes32 => address) public markets;

    
    function MoonMarket() {
        owner = msg.sender;
    }

    function replaceOwner(address _owner){
        if(msg.sender != owner) throw;
        owner = _owner;
    }

    function addMarket(bytes32 name) returns (address marAddr) {
        //no check on msg.sender, anyone can open a market
        address temp = new Market();
        markets[name] = temp;
        return temp;
    }

    function deleteMarket(bytes32 name) returns (bool result){
        if(markets[name] == 0x0){
            return false;
        }
        if(msg.sender != owner) throw;
        markets[name] = 0x0;
        suicide(markets[name]);
        return true;
    }

    function getMarket(bytes32 name) constant returns (address addr){
        return markets[name];
    }
    
    function remove() {
        if (msg.sender == owner){
            //don't suicide, put in state that error handles
            suicide(owner);
        }
    }
}


contract Market {

    address public admin;
    //use different datatype to store ipfs hash
    string public dataHash1;
    string public dataHash2;
    enum State {Created, Destroyed}
    State public state;

    function Market() {
        admin = msg.sender;
    }

    function setHash(string firstPart, string secondPart) {
        if(state == State.Destroyed) throw;
        dataHash1 = firstPart;
        dataHash2 = secondPart;   
    }

    function setMarketOwner(address ownAddr) returns (bool result){
        if(state == State.Destroyed) throw;
        if(admin != 0x0 && ownAddr == admin){
            return false;
        }
        admin = ownAddr;
        return true;
    }

    function remove() {
        if (msg.sender == admin){
            //suicide(admin);
            //suicide does not free up blockchain space and can trap txs
            state = State.Destroyed;
        }
    }
}
