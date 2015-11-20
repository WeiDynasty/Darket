@Contracts = @Contracts || {}

//syncing contract is now each market contract that stores the IPFS data hash for that market

getIPFSData = ->
  ipfsHash = Contracts.Sync.getHash1() + Contracts.Sync.getHash2()
  ipfs.cat ipfsHash, (err,res) ->
    for doc in res
      # check if it exists
      if Cols.Markets.findOne(doc._id)
        update = _.clone doc
        delete update._id
        Cols.Markets.update doc._id, $set: update
      else
        Cols.Markets.insert doc

Meteor.startup ->
  Contracts.SyncContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"getHash1","outputs":[{"name":"part1","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"getHash2","outputs":[{"name":"part2","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"firstPart","type":"string"},{"name":"secondPart","type":"string"}],"name":"setHash","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"one","type":"string"},{"indexed":false,"name":"two","type":"string"}],"name":"onUpdate","type":"event"}]);
  Contracts.Sync = Contracts.SyncContract.at('0x9516f2fc88491d58113b26ab595f3a3fb4fc4ee0')
  # on start, syncup with the hashes
  Contracts.Sync.onUpdate getIPFSData
  getIPFSData()
