contract MoonMarket {
    
    address public owner;
    mapping (bytes32 => address) public markets;
    mapping (address => address[])[] data;

    
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

    function deleteMarket(address dmAddr){
        //todo delete function 
    }
    
    function remove() {
        if (msg.sender == owner){
            suicide(owner);
        }
    }
}


contract Market {

    address public admin;


    function Market() {
    	admin = msg.sender;
    }

    function setMarketAddress(address marketAddr) returns (bool result){
        if(admin != 0x0 && marketAddr != admin){
            return false;
        }
        admin = marketAddr;
        return true;
    }

    function remove() {
        if (msg.sender == admin){
            suicide(admin);
        }
    }
}