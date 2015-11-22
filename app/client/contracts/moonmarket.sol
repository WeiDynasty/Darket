contract MoonMarket {
    
    address public owner;
    mapping (bytes32 => address) public markets;
    enum State {Created, Destroyed}
    State public state;
    
    function MoonMarket() {
        owner = msg.sender;
    }

    function replaceOwner(address _owner){
        if(state == State.Destroyed) throw;
        if(msg.sender != owner) throw;
        owner = _owner;
    }

    function addMarket(bytes32 name) returns (address marAddr) {
        if(state == State.Destroyed) throw;
        //no check on msg.sender, anyone can open a market
        //construct with msg.sender gives permission admin to the person creating the market
        address temp = new Market(msg.sender);
        markets[name] = temp;
        return temp;
    }

    function deleteMarket(bytes32 name) returns (bool result){
        if(state == State.Destroyed) throw;
        if(markets[name] == 0x0){
            return false;
        }
        if(msg.sender != owner) throw;
        Market(markets[name]).remove();
        markets[name] = 0x0;
        
        return true;
    }

    function getMarket(bytes32 name) constant returns (address addr){
        if(state == State.Destroyed) throw;
        return markets[name];
    }

    function getAllMarkets() constant returns (address[]){
        //TODO create this function and test
    }
    
    function remove() {
        if (msg.sender == owner){
            //don't suicide, put in state that error handles
            //suicide(owner);
            state = State.Destroyed;
        }
    }
}


contract Market {

    address public admin;
    mapping (bytes32 => address) public products;
    //use different datatype to store ipfs hash
    string public dataHash1;
    string public dataHash2;
    enum State {Created, Destroyed}
    State public state;

    function Market(address init) {
        //gives permission to the calling contract
        //admin = msg.sender;
        admin = init;
    }

    function setHash(string firstPart, string secondPart) {
        if(state == State.Destroyed) throw;
        dataHash1 = firstPart;
        dataHash2 = secondPart;   
    }

    function setMarketAdmin(address ownAddr) returns (bool result){
        if(state == State.Destroyed) throw;
        if(admin != 0x0 && ownAddr == admin){
            return false;
        }
        admin = ownAddr;
        return true;
    }
    
    function addProduct(bytes32 name) returns (address prodAddr) {
        if(state == State.Destroyed) throw;
        //perm to post given to admin
        if(msg.sender != admin) throw;
        address prodTemp = new Product();
        products[name] = prodTemp;
        return prodTemp;
    }

    function remove() {
        if (msg.sender == admin){
            //suicide(admin);
            //suicide does not free up blockchain space and can trap txs
            state = State.Destroyed;
        }
    }
}

contract Product {
	address public owner;
	uint public itemNum;
	enum State {Created, Destroyed}
	State public state;
	
	function Product(){
		//owned by the market contract 
		owner = msg.sender;
	}
	
}
