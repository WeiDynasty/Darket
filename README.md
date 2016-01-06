# Market Dapp

[![Join the chat at https://gitter.im/WeiDynasty/Market-Dapp](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/WeiDynasty/Market-Dapp?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

### The Distributed Marketplace

This is the react version of the Meteor Market-Dapp. 

This version of the market can be hashed and added to IPFS for distribution (with a geth and IPFS node running). When a distribution is published with a hash you will be able to use this by visiting.

```
localhost:8080/ipfs/<hash>
```

Otherwise if you would like to hack this

# Instructions on running your own applcation
This application requires no server and can be distributed over IPFS. Currently you will need to install and run both an IPFS node and a Geth client as well as gulp to build your own dist file if you would like to edit the application. 

### Install IPFS

Install instructions can be found <a href="www.ipfs.io/install">here</a>

### Install Geth

Install instructions for geth can be found <a href="https://github.com/ethereum/go-ethereum/wiki/geth">here</a>

### Clone the Repo

```
git clone https://github.com/WeiDynasty/Market-Dapp.git
``` 

### Install the packages
```
sudo npm install i
```

### Build the dist file
```
cd Market-Dapp
gulp
```

### Hash the contents with IPFS and view on a gateway

```
ipfs add . -r
```

Enjoy!
---

MIT 2015, Public Domain Attribution
