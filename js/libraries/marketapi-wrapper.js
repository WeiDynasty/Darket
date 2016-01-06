var MarketAPI = function(){
  this.done = false
  this.fa = []
  this.account
  this.id = Math.random()
  var MarketAPI = require('./marketapi.js')
  //var ipfs = require('ipfs-api')(opt.addr || 'localhost',opt.port || 5001)
  //var ipfs = require('ipfs-api')('localhost', 5001);
  var ipfs = window.ipfsAPI('localhost', 5001);
/*  this needs to be in the html for now, gulp cant require the full web3.js
  var Web3 = require('web3')
  var web3 = new Web3()*/
  this.account = new MarketAPI(ipfs, web3)
  this.account.init()
  this.done = true
  this.fa.forEach(fn => fn(this.account))
  this.fa = undefined

}

MarketAPI.prototype.use = function(f){
  if(!f || !f.apply || !f.call) return console.log('Non-function tried to use API:',f)
  if(this.done){
    f(this.account)
  } else {
    this.fa.push(f)
  }
}

module.exports = MarketAPI