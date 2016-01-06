var MarketAPI = require('../js/libraries/marketapi-wrapper.js')

var CommentBox = React.createClass({

	initialize: function(){	    
	    var user = new MarketAPI();
	    //example of using the netid api to get the eth balance
	    var web3test = user.account.getBalance();
	    console.log('Balance: '+web3test+' Ether')
		var self = this 
		self.setState({
			api: user
		})
	    if(!this.isMounted()) return
	    var ee = user.account.getEventEmitter()
	    ee.on('init',err => {
	      if(!err && this.isMounted()){
	      	console.log('finished initializing api')
	      	var schemObj = user.account.schemaObject
	        self.setState({ 
	        	showLoading: false,
	        	personas: schemObj,
	        	activePersona: schemObj[0]
	        });
	      }
	      if(err){
	      	console.log(err)
	      }
	    })	
	},
    componentDidMount: function(){
    	var self  = this;
    	this.initialize();
    },
	render: function() {
		return (
		  <div className="commentBox">
		    Hello, let's change the world!
		  </div>
		);
	}
});
ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);