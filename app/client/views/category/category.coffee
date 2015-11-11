Template.category.helpers
  markets: ->
    Cols.Markets.find category: FlowRouter.getParam('category')