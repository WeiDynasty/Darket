@Cols =
  Markets: new Meteor.Collection 'Markets'

if Meteor.isServer
  if Cols.Markets.find().count() is 0
    console.log 'No market data; seeding'