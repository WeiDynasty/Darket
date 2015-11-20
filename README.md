# Market Dapp

### The Distributed Marketplace

This project is a work in progress.

<h5> Dapp Structure </h5>

	-Interface: JS + HTML% + CSS3
	-Storage (client): minimongo
	-Hosting: IPFS 

IPFS BUILD: QmYKnuxh82bjdsunbovZ6aDRG1CiEGkPtaBQE5VetAXebb

<h5>Instructions:</h5> 

<b>Testnet</b>

<code> geth --rpc --networkid=39318 --maxpeers=0 --datadir=~/.ethereum/DevChain/ --mine --minerthreads 2 --genesis /home/nathan/gen.json --etherbase 'fdff6d471a57e0fc4175a1ecd478372f8e6698ef' --unlock fdff6d471a57e0fc4175a1ecd478372f8e6698ef console
</code>  

Genesis file
<code>
{
    "nonce": "0x0000000000000042",
    "difficulty": "0x40000",
    "alloc": {
            "fdff6d471a57e0fc4175a1ecd478372f8e6698ef": {
            "balance": "10015200000000000000000"
        }
    },
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x0000000000000000000000000000000000000000",
    "timestamp": "0x00",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "extraData": "0x",
    "gasLimit": "0x4c4b40"
}
</code>

Clone the build, run a local server in the root dir, start geth + IPFS

## Things that need to be done

* Formalized roadmap for release targets
* Rename the schema
  * Market - The root contract for a given marketplace
  * Category - A subcategory within each market (Art, Bread, Clothes)
  * Product - An individual item, can have multiple sales
  * Sale - A single delivery
* Proper registry system
  * Anyone should be able to create their own market with arbitrary rules with regards to categories and products submissions. We need to describe a standard API for allowing a contract to determine what can or cannot be registered on a market.
  * Should be as lean as possible; use IPFS as much as possible
  * An efficient way to search within a market
  * Wait for dapp store to open source -- it has most of the the answers
* Better escrow contract
  * Needs to be able to handle multiple sales of the same product
  * Encrypted data to handle delivery address (? might not be needed if we have whisper)
  * Needs to be able to handle edge cases such as either party dying (dead mans switch / fair timeout)
  * Instead of a deposit, can we use some kind of insurance contract/DAO?
* Modular sales contracts (?)
  * Auctions
  * Sealed auctions
  * But it now
  * Crowd-funds
* UI Improvements
  * Changeable currency rate
  * Proper validation
  * Accounts Selection
* Whisper Chat
* Mist integration
* Tests
* Standardised/Suggested Development Environment
* Contrib Guidelines
* Packageize
* Maybe switch from `dapp-styles` to bootstrap/materialize
* [x] Setup testnet
* Package a build that can run in a static directory to eliminate local server
* Research/Test dispute system
  * Voting contract
  * Reputation contract
* Improve syncing data
  * Add check to contract that ensures old data exists in new object
  * Service Discovery  [Discussion] (https://github.com/ipfs/notes/issues/15)
* Browser implementation roadmap [Discussion] (https://github.com/ipfs/js-ipfs)
* Write checks for Eth and IPFS Daemons on app load, display error screen
* Write name reg DOUG for giving name to ethereum addresses as a simple login system

---

MIT 2015, Public Domain Attribution
