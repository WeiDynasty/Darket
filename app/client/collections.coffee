@Cols =
  Markets: new Meteor.Collection null # offline

# if Meteor.isServer
#   if Cols.Markets.find().count() is 0
#     console.log 'No market data; seeding'