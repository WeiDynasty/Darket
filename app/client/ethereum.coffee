@web3 = new Web3()

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

EthTools.setUnit('btc')
EthAccounts.init()

UI.registerHelper 'myAccounts', -> EthAccounts.find()