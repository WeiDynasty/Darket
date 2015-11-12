@web3 = new Web3()

EthTools.setUnit('btc')

UI.registerHelper 'myAccounts', ->
  # todo replace with real data
  [
    type: "account"
    name: 'My Account 1'
    balance: '1000000000000000000'
    address: '0x922a519ac926f69856fcfc1b2b8b846cfb3f6b4e'
  ,
    name: 'My Other Address'
    balance: '324567543200000013456'
    address: '0x1f93d965f60faee1085a93e99562945c1bd97be0'
  ]