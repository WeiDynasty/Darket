# Market Dapp

### The Distributed Marketplace

This project is a work in progress.

<h5> Dapp Structure </h5>

	-Interface: JS + HTML% + CSS3
	-Storage (client): minimongo
	-Hosting: IPFS 

IPFS BUILD: QmYKnuxh82bjdsunbovZ6aDRG1CiEGkPtaBQE5VetAXebb

<h5>Instructions:</h5> 

<b><a href="https://github.com/WeiDynasty/Market-Dapp/blob/develop/tests/README.md">Testnet Information</a></b>

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
  * <a href="https://github.com/pipermerriam/ethereum-alarm-clock">Alarm Clock for scheduling a kill timer to disputes</a>
  * Voting contract
  * Reputation contract
* Improve syncing data
  * Add check to contract that ensures old data exists in new object
  * Service Discovery  [Discussion] (https://github.com/ipfs/notes/issues/15)
* Browser implementation roadmap [Discussion] (https://github.com/ipfs/js-ipfs)
* Write checks for Eth and IPFS Daemons on app load, display error screen
* [x] Write name reg for market contracts in Control contract

---

MIT 2015, Public Domain Attribution
