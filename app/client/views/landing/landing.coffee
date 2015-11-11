Template.landing.helpers
  popularCategories: ['art', 'books', 'cars', 'developers', 'energy drinks']

Template.landing.events
  'submit .set-category' : (e) ->
    e.preventDefault()
    formData = $(e.currentTarget).serializeJSON()
    if category = formData.category
      FlowRouter.go "/category/#{category}"

  'click .popular-category' : ->
    FlowRouter.go "/category/#{@.toString()}"

