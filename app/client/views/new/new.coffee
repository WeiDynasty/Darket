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

    newMarket = Cols.Markets.insert formData
    FlowRouter.go "/category/#{formData.category}/#{newMarket}"

