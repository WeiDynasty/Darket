contract MoonMarket {
    
    address public owner;
    mapping (bytes32 => address) public markets;

    
    function MoonMarket() {
    	owner = msg.sender;
    }

    function addMarket(bytes32 name, address addr) returns (bool result) {
        Market mar = Market(addr);

        if(!mar.setMarketAddress(address(this))) {
            return false;
        }
        markets[name] = addr;
        return true;
    }

    function deleteMarket(bytes32 name) returns (bool result){
        if(markets[name] == 0x0){
            return false;
        }
        if(msg.sender != owner) throw;
        markets[name] = 0x0;
        return true;
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
    enum State {Created, Destroyed}
    State public state;

    function Market() {
    	admin = msg.sender;
    }

    function setMarketAddress(address marketAddr) returns (bool result){
        if(state == State.Destroyed) throw;
        if(admin != 0x0 && marketAddr != admin){
            return false;
        }
        admin = marketAddr;
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