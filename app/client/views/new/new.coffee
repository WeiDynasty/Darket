
Template.new.events
  'submit form' : (e) ->
    e.preventDefault()
    formData = $(e.currentTarget).serializeJSON()
    formData.category = formData.category.toLowerCase()

    # TODO proper validation
    for field, val of formData
      unless val
        alert 'Validation error'
        return false

    # deploy a contract with the values
    # deployContract->
    #     formData.contractAddress = ...
    $('button').after("Mining Contract...").remove()

    thisAccount = TemplateVar.getFrom('.dapp-select-account', 'value');

    unless thisAccount
      alert 'Pick an account'
      return false

    unless formData.price % 2 == 0
      alsert 'Price must be divisible by 2'
      return false


    myEscrow = Contracts.EscrowContract.new
       from: thisAccount
       data: Contracts.EscrowContractData
       value: formData.price
       gas: 3000000
    , (err, contract) ->
      if err
        alert err
      else if contract.address
        console.log 'deployed contract at', contract.address

        formData.contractAddress = contract.address

        newMarket = Cols.Markets.insert formData
        # save this on ipfs
        ipfsObj = Cols.Markets.find().fetch()
        console.log 'saving', ipfsObj
        ipfs.add ipfs.Buffer(JSON.stringify(ipfsObj)), (err, res) ->
          console.log err, res
          returnHash = res.Hash

          firstHalf = returnHash.substr(0, 24)
          secondHalf = returnHash.substr(24)

          # set main contract hash
          Contracts.Sync.setHash firstHalf, secondHalf,
            gas: 300000
            from: thisAccount
          , (err, res) ->
            console.log 'saved IPFS', err, res
            FlowRouter.go "/category/#{formData.category}/#{newMarket}"

