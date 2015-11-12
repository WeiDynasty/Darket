Template.landing.helpers
  popularCategories: ->
    _.uniq _.pluck Cols.Markets.find().fetch(), 'category'

Template.landing.events
  'submit .set-category' : (e) ->
    e.preventDefault()
    formData = $(e.currentTarget).serializeJSON()
    if category = formData.category
      FlowRouter.go "/category/#{category}"

  'click .popular-category' : ->
    FlowRouter.go "/category/#{@.toString()}"

