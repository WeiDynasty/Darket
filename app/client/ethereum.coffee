unless web3
  @web3 = new Web3()
  web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

EthAccounts.init()

Template.registerHelper 'myAccounts', -> EthAccounts.find().fetch()
Template.registerHelper 'JSON', (str) -> JSON.stringify(str)