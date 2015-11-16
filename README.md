# Market Dapp

### The Distributed Marketplace

This project is a work in progress.

IPFS BUILD: QmYKnuxh82bjdsunbovZ6aDRG1CiEGkPtaBQE5VetAXebb

Instructions: Clone the build, run a local server in the root dir, start geth + IPFS

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
* Setup testnet 

---

MIT 2015, Public Domain Attribution
