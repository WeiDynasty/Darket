contract MoonMarket {
    
    address public owner;
    mapping (bytes32 => address) public markets;

    
    function MoonMarket() {
    	owner = msg.sender;
    }

    function createMarket() returns (address mAddr){
       return address(new Market());
    }

    function deleteMarket(address dmAddr){
        Market(dmAddr).remove();
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

    function remove() {
        if (msg.sender == admin){
            suicide(admin);
        }
    }
}
