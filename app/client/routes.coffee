BlazeLayout.setRoot 'body'

FlowRouter.route '/',
  name: 'landing'
  action: ->
    BlazeLayout.render "mainLayout", main: "landing"

FlowRouter.route '/new',
  name: 'new'
  action: (params) ->
    BlazeLayout.render "mainLayout", main: "new"

FlowRouter.route '/category/:category',
  name: 'category'
  action: (params) ->
    BlazeLayout.render "mainLayout", main: "category"

FlowRouter.route '/category/:category/:market',
  name: 'market'
  action: (params) ->
    BlazeLayout.render "mainLayout", main: "market"
