"use strict"
var EventEmitter = require('wolfy87-eventemitter')
var asyncjs = require('async')

function asObj(str,done){
  if(str.toString) str = str.toString()
  if(typeof str === 'string'){
    var obj
    try {
      obj = JSON.parse(str)
    } catch (e) {
      console.log('error parsing:',str,'Error:',e)
      return done(e,undefined)
    }
    done(null,obj)
  } else {
    console.log('not string:',str)
    done('not string: '+str,undefined)
  }
}

function replyAsObj(res,isJson,done){
  if(res.readable){
    // Is a stream
    console.log('got stream')
    res.setEncoding('utf8')
    var data = ''
    res.on('data',d => {
      console.log('got stream data:',d)
      data += d
    })
    res.on('end',() => {
      if(isJson) {
        asObj(data,done)
      } else {
        done(null,data)
      }
    })
  } else if(res.split || res.toString){
    //console.log('got string or buffer:',res)
    if(res.toString) res = res.toString()
    // Is a string
    if(isJson){
      asObj(res,done)
    } else {
      done(null,res)
    }
  }
}

function MarketAPI(ipfs, web3){
  this.ipfs = ipfs
  this.web3 = web3
  this.version = 'dev'
  this.baseurl = '/market-account/'
  this.users = {} // userID : profileHash
  this.resolving_ipns = {} // to check if a resolve is already in progress
  this.ee = new EventEmitter()
  if(localStorage !== undefined){
    // Use localStorage to store the IPNS cache
    var stored = localStorage.getItem('market-user-cache')
    try {
      this.users = JSON.parse(stored)
      if(this.users === null || this.users === undefined){
        this.users = {}
      }
    } catch(e){
      this.users = {}
    }
  }
}
// Rewrote this to use event emitters. Should also add periodic rechecking
MarketAPI.prototype.resolveIPNS = function(n,handler){
  var self = this
  if(this.resolving_ipns[n] != true){
    this.resolving_ipns[n] = true
    this.ipfs.name.resolve(n,(err,r) => {
      if(err){
        this.ipfs.files.stat('/market-account', function(err,res){
          if(err){  
            swal({   
                title: "Error!",   
                text: 'You do not have an account... Please create one!',   
                type: "error",   
                confirmButtonText: "Close" 
              })
            self.ee.emit('initfail')
            self.ee.removeEvent('initfail')
          }
          if(res){
            swal({   
                title: "Error!",   
                text: 'IPFS resolve failed but an account was found. Please republish your files api root',   
                type: "error",   
                confirmButtonText: "Close" 
              })
            self.ee.emit('initfail')
            self.ee.removeEvent('initfail')
          }
        })
      } else {
        console.log('IPNS Data Hash Path: ' + r.Path)
        this.idhash = r.Path
        var url = r.Path
        if(url === undefined){
          console.log('Could not resolve',n)
        } else this.isUserProfile(url,(isit,err) => {
          //this was getting pulled from temp storage
          //else if(this.users[n] != url) this.isUserProfile(url,(isit,err) => {
          if(isit){
            this.ee.emit('initdone',undefined)
            this.ee.removeEvent('initdone')
          } else {
            console.log('failed to sign in')
            this.ee.emit('initfail',undefined)
            this.ee.removeEvent('initfail')
          }
          this.resolving_ipns[n] = false
          return true // Remove from listeners
        })
      }
    })
  }
  return this.ee
}

MarketAPI.prototype.isUserProfile = function(addr,done){
  var self = this
  if(addr === undefined) return console.log('Asked to check if undefined is a profile')
  self.ipfs.cat(addr+self.baseurl+'user.txt',(err,r) => {
    if(err){
      swal({   
              title: "Error!",   
              text: 'You do not have an account yet, please create one',   
              type: "error",   
              confirmButtonText: "Close" 
      })
      done(false)
    }
      if(r == self.version){
        console.log('Account Found With Mathcing Version: ' + r)
        self.ipfs.cat(addr+self.baseurl+'accountInfo.json',function(err,res){
          if(err){
            swal({   
              title: "Error!",   
              text: 'User Data Does Not Exist',   
              type: "error",   
              confirmButtonText: "Close" 
            })
            done(false)
          }
          if(res){
            self.userObj = JSON.parse(res)
            done(true)
          }
        })
    }
  })
}

MarketAPI.prototype.checkForEthereum = function(){
  if(!web3.isConnected()) {
    swal({   
            title: "Error!",   
            text: 'Geth account is not connected.',   
            type: "error",   
            confirmButtonText: "Close" 
          })
    this.ee.emit('initfail')
    this.ee.removeEvent('initfail')
    return false
  } else {
    return true
  }
}

// API for publishing content and managing to be done later...

// Initialize API
MarketAPI.prototype.init = function(done){
  if(this.isInit) return
  this.web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
  if(!web3.isConnected()) {
    swal({   
            title: "Error!",   
            text: 'Geth account is not connected.',   
            type: "error",   
            confirmButtonText: "Close" 
          })
    this.ee.emit('initfail')
    this.ee.removeEvent('initfail')
    return
  }   
  this.ipfs.id( (err, res) => {
    if(err){
      swal({   
            title: "Error!",   
            text: 'IPFS Client Not Found',   
            type: "error",   
            confirmButtonText: "Close" 
      })
      this.ee.emit('initfail')
      this.ee.removeEvent('initfail')
      console.log('Error while getting OWN ID:',err)
    } else if(res.ID){
      console.log('IPFS ID: ',res.ID)
      this.id = res.ID
      //this can probably be replaced with 'ipfs files stat /' for all local queries to own database 
      this.resolveIPNS(res.ID)
      console.log('Market version is',this.version)
    }
  })
}

MarketAPI.prototype.getEventEmitter = function(){
  return this.ee
}

MarketAPI.prototype.getUsers = function(){
  return Object.keys(this.users)
}

MarketAPI.prototype.getMyID = function(){
  return this.id
}

MarketAPI.prototype.getMarkets = function(){
  var marketsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"dataHash2","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash1","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"}]);
  var markets = marketsContract.at('0x6737d20a2452fee7c86b547be3bea096b60f3321')
  var str = markets.dataHash1()+markets.dataHash2()
  this.ipfs.cat(str,(err2,res) => {
    if(err2){
      this.ee.emit('error',err2)
      //done(err2,null)
    } else {
      // TODO: JSON parse error handling
      this.marketsList = JSON.parse(res)
      console.log(this.marketsList)
      this.ee.emit('markets')
      this.ee.removeEvent('markets')
      //done(null,p)
    }
    return this.marketsList
  })
}

MarketAPI.prototype.getAddresses = function(active){
  if(active == false){
    this.web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
    if(!web3.isConnected()) {
    swal({   
            title: "Error!",   
            text: 'Geth account is not connected.',   
            type: "error",   
            confirmButtonText: "Close" 
          });
    return false
    }
  }
  var addys = this.web3.eth.accounts
  return addys
}

MarketAPI.prototype.getActiveAddr = function(num){
  var addr = this.web3.eth.accounts[num]
  return addr
}

MarketAPI.prototype.getBalance = function(addr){
  var coinbase = this.web3.eth.coinbase
  if(addr == undefined){
    var originalBalance = "No account"
  }else{
    var originalBalance = this.web3.fromWei(this.web3.eth.getBalance(addr).toNumber())
  }
  console.log(coinbase)
  console.log(addr)
  return originalBalance
}

MarketAPI.prototype.getProducts = function(addr){
  var productsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"dataHash2","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash1","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"}]);
  var products = productsContract.at(addr)
  var pstr = products.dataHash1()+products.dataHash2()

  this.ipfs.cat(pstr,(err2,res) => {
    if(err2){
      this.ee.emit('error',err2)
      //done(err2,null)
    } else {
      // TODO: JSON parse error handling
      this.productsList = JSON.parse(res)
      console.log(this.productsList)
      this.ee.emit('products')
      this.ee.removeEvent('products')
      //done(null,p)
    }
    return this.productsList
  })
  
}

MarketAPI.prototype.createAccount = function(persona, oldData, done){
  var accountArr = oldData
  console.log('Creating new account')
  try {
    accountArr.push(persona)
    var profile_str = JSON.stringify(accountArr)
  } catch (e) {
    console.log('Error, invalid account data:', e)
    return done(e)
  }
  console.log(profile_str)
  //not working
  var self = this
  self.ee.emit('createdone')
  self.ee.removeEvent('createdone')

  asyncjs.waterfall([
    // Create required directories
    // Might do this in the account creation process and hope that it doesn't get lost, could need checks here
    cb => this.ipfs.files.mkdir('/market-account', { p: true }, cb),
    (e, cb) => {
      // Remove old profile files if present
      var path = '/market-account/accountInfo.json'
      console.log('removing path ' +path)
      this.ipfs.files.rm(path, { r: true }, (err, res) => {
        if (err) 
          cb(err)
        console.log('removed old account json file...')
        cb()
      })
      //TODO: remove and add the version txt for account checking here
    },
    (cb) => {
      // Serialize profile and add to IPFS
      this.ipfs.add(new Buffer(profile_str), cb)
    },
    (res, cb) => {
      // Move profile into mfs
      console.log('added profile to IPFS:', res.Hash)
      var profilepath = '/ipfs/' + res.Hash
      this.ipfs.files.cp([profilepath, '/market-account/accountInfo.json'], cb)
    },
    (e, cb) => this.ipfs.files.stat('/', cb),
    (res, cb) => {
      var profile_hash = res.Hash
      console.log('Publishing profile...')
      this.ipfs.name.publish(profile_hash, cb)
    }
  ], done)
}

MarketAPI.prototype.createProductContract = function(newdata, oldlist, addr, price){
  console.log("inputs to createProductContract()")
  console.log(newdata)
  console.log(oldlist)
  var self = this
  var productsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"seller","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"abort","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"refund","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"buyer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"confirmReceived","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[],"name":"confirmPurchase","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"Aborted","type":"event"},{"anonymous":false,"inputs":[],"name":"PurchaseConfirmed","type":"event"},{"anonymous":false,"inputs":[],"name":"ItemReceived","type":"event"},{"anonymous":false,"inputs":[],"name":"Refunded","type":"event"}]);

  var products = productsContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '60606040525b600060023406148015156016576002565b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060023404600060005081905550505b6106f18061005e6000396000f36060604052361561008a576000357c01000000000000000000000000000000000000000000000000000000009004806308551a531461009757806335a063b4146100d05780633fa4f245146100df578063590e1ae3146101025780637150d8ae1461011157806373fac6f01461014a578063c19d93fb14610159578063d69606971461017c5761008a565b6100955b610002565b565b005b6100a4600480505061055f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100dd60048050506105be565b005b6100ec6004805050610556565b6040518082815260200191505060405180910390f35b61010f60048050506103c6565b005b61011e6004805050610585565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101576004805050610239565b005b61016660048050506105ab565b6040518082815260200191505060405180910390f35b610189600480505061018b565b005b600080600260149054906101000a900460ff161415156101aa57610002565b60006000505460020234148015156101c157610002565b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506001600260146101000a81548160ff021916908302179055507fd5d55c8a68912e9a110618df8d5e2e83b8d83211c57a8ddd1203df92885dc88160405180905060405180910390a150505b565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561029557610002565b600180600260149054906101000a900460ff161415156102b457610002565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000600060005054604051809050600060405180830381858888f1935050505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050506002600260146101000a81548160ff021916908302179055507fe89152acd703c9d8c7d28829d443260b411454d45394e7995815140c8cbcbcf760405180905060405180910390a1505b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561042257610002565b600180600260149054906101000a900460ff1614151561044157610002565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166000600060005054600202604051809050600060405180830381858888f1935050505050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050506002600260146101000a81548160ff021916908302179055507f8616bbbbad963e4e65b1366f1d75dfb63f9e9704bbbf91fb01bec70849906cf760405180905060405180910390a1505b565b60006000505481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260149054906101000a900460ff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561061a57610002565b600080600260149054906101000a900460ff1614151561063957610002565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1660003073ffffffffffffffffffffffffffffffffffffffff1631604051809050600060405180830381858888f19350505050506002600260146101000a81548160ff021916908302179055507f72c874aeff0b183a56e2b79c71b46e1aed4dee5e09862134b8821ba2fddbf8bf60405180905060405180910390a1505b56', 
     value: price,
     gas: 3000000
   }, function(e, contract){
    if(e){
      swal({   
            title: "Error!",   
            text: e,   
            type: "error",   
            confirmButtonText: "Close" 
          });
      self.ee.emit('productcontractfail',undefined)
      self.ee.removeEvent('productcontractfail')
    }
    console.log(e, contract);
    if (typeof contract.address != 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
         newdata.contract = contract.address
         oldlist.push(newdata)
         self.newProductsList = oldlist
         console.log('this is sent to saveProduct')
         console.log(oldlist)
         self.saveProductContract(oldlist, addr)
    }
 })
}

MarketAPI.prototype.saveProductContract = function(data, addr){
  var self = this
  var market_str = JSON.stringify(data)
  console.log('this is sent to cat function '+market_str)
  var productsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"dataHash2","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash1","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"}]);
  var products = productsContract.at(addr)

  self.ipfs.add(new Buffer(market_str), function(err, res){
    if(err){
      console.log(err)
    }
    if(res){
      console.log('contract saved to ipfs... now sending tx to contract')
      var returnHash = res.Hash

      var firstHalf = returnHash.substr(0, 24)
      var secondHalf = returnHash.substr(24)

      products.setHash(firstHalf, secondHalf, {from: web3.eth.accounts[0], gas: 100000})
      self.ee.emit('productcontract')
      self.ee.removeEvent('productcontract')
    }
  })
}

MarketAPI.prototype.createMarketContract = function(newdata, oldlist){
  console.log("inputs to createMarketContract()")
  console.log(newdata)
  console.log(oldlist)
  var self = this
  var marketsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"dataHash2","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash1","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"}]);

  var markets = marketsContract.new(
   {
     from: web3.eth.accounts[0], 
     data: '6060604052610483806100126000396000f360606040526000357c0100000000000000000000000000000000000000000000000000000000900480635199bdad1461004f57806398dae056146100ca578063e15fe023146101455761004d565b005b61005c6004805050610283565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156100bc5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100d760048050506101e2565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101375780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101e06004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091908035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610324565b005b60006000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561027b5780601f106102505761010080835404028352916020019161027b565b820191906000526020600020905b81548152906001019060200180831161025e57829003601f168201915b505050505081565b60016000508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561031c5780601f106102f15761010080835404028352916020019161031c565b820191906000526020600020905b8154815290600101906020018083116102ff57829003601f168201915b505050505081565b8160006000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061037357805160ff19168380011785556103a4565b828001600101855582156103a4579182015b828111156103a3578251826000505591602001919060010190610385565b5b5090506103cf91906103b1565b808211156103cb57600081815060009055506001016103b1565b5090565b50508060016000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061042057805160ff1916838001178555610451565b82800160010185558215610451579182015b82811115610450578251826000505591602001919060010190610432565b5b50905061047c919061045e565b80821115610478576000818150600090555060010161045e565b5090565b50505b505056', 
     gas: 3000000
   }, function(e, contract){
    if(e){
      swal({   
            title: "Error!",   
            text: e,   
            type: "error",   
            confirmButtonText: "Close" 
          });
      self.ee.emit('marketcontractfail',undefined)
      self.ee.removeEvent('marketcontractfail')
    }
    console.log(e, contract);
    if (typeof contract.address != 'undefined') {
         console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
         newdata.contract = contract.address
         oldlist.push(newdata)
         self.newMarketsList = oldlist
         console.log('this is sent to saveContract')
         console.log(oldlist)
         self.saveMarketContract(oldlist)
    }
  })
}

MarketAPI.prototype.saveMarketContract = function(data){
  var self = this
  var market_str = JSON.stringify(data)
  console.log('this is sent to cat function '+market_str)
  var marketsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"dataHash2","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash1","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"}]);
  var markets = marketsContract.at('0x6737d20a2452fee7c86b547be3bea096b60f3321')

  self.ipfs.add(new Buffer(market_str), function(err, res){
    if(err){
      console.log(err)
    }
    if(res){
      console.log('contract saved to ipfs... now sending tx to contract')
      var returnHash = res.Hash

      var firstHalf = returnHash.substr(0, 24)
      var secondHalf = returnHash.substr(24)

      markets.setHash(firstHalf, secondHalf, {from: web3.eth.accounts[0], gas: 100000})
      self.ee.emit('marketcontract')
      self.ee.removeEvent('marketcontract')
    }
  })
}

MarketAPI.prototype.getProductStatus = function(addr){
  //do web3 connects and check the status of each contract
  //var t = "\'"+addr+"\'"
  //console.log(addr)
  var interactionsContract = this.setEthereumAbi("interactions"); 
  try{
    var interactions = interactionsContract.at(addr)
    var st = interactions.state()
    //console.log('This is the state '+interactions.state())
    return st
  }catch(err) {
    console.log(err)
  }
}

MarketAPI.prototype.updateIntStatus = function (address, status) {
  var intContAbi = this.setEthereumAbi("interactions");
  var intCont = intContAbi.at(address);
  if(status == 0)
    intCont.confirmInvite({from: web3.eth.accounts[0], gas: 100000});
  else
    console.log("contract status is not defined: MarketAPI.protptype.updateIntStatus()");
}

//Central Place to get ABI for ethereum (keep adding new switches for each new ethereum contract abi)
MarketAPI.prototype.setEthereumAbi = function (contractName){
  switch(contractName){
    case "interactions" : 
      var interactionsContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"disputed","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"initiatorRating","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"setToFinal","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"responderConf","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"responder","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"confirmRating","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"responderRating","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash2","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"respRated","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"rateCount","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"initiator","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"disputer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[],"name":"initRated","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"dataHash1","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"initiatorConf","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"state","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":false,"inputs":[],"name":"confirmInvite","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"cancelInvite","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"init","type":"address"}],"name":"setInitiator","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"rating","type":"uint256"}],"name":"rate","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"dispute","outputs":[],"type":"function"},{"inputs":[{"name":"init","type":"address"}],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"InteractionConfirmed","type":"event"},{"anonymous":false,"inputs":[],"name":"InitRated","type":"event"},{"anonymous":false,"inputs":[],"name":"RespRated","type":"event"},{"anonymous":false,"inputs":[],"name":"Rated","type":"event"},{"anonymous":false,"inputs":[],"name":"Disputed","type":"event"},{"anonymous":false,"inputs":[],"name":"Confirmed","type":"event"}]);
  
      return interactionsContract;
      
    default: console.log("No Ethereum ABI found for contract " + contractName);
  }
}


module.exports = MarketAPI