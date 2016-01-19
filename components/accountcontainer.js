import MarketAPI from '../js/libraries/marketapi-wrapper'

const AccountContainer = React.createClass({
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
	    ee.on('initdone',err => {
	      if(!err && this.isMounted()){
	      	console.log('finished initializing api')
	      	swal({   
	            title: "Success!",   
	            text: 'You are now signed in and ready to use the markets',   
	            type: "info",   
	            confirmButtonText: "Close" 
          	});
	        self.setState({ 
	        	"loadingImg": "test",
	        	"user": user
	        });
	        self.props.handleUserIcon('test')
	      }
	      if(err){
	      	console.log(err)
	      }
	    })	
	},
	componentDidMount: function(){    	
    	this.initialize()
    },
	render: function() {
		var tablestyle = {
			width:'100%'
	    }
		return (
		<div>
		<div className="row">
    		<div className="text-center">
    		<h1>You Are Logged In!</h1>
    		<br/>
    		<br/>
    		<h3>Account Information</h3>
    			<div className="col-md-8 col-md-offset-2">
    				<br/>
    				<br/>
    				<table style={tablestyle}>
    				<tbody>
					  <tr>
					    <td>Username:</td>
					    <td>voxelot</td> 
					  </tr>
					  <tr>
					    <td>IPFS ID:</td>
					    <td>QmYii1eatYx5YEYBBZzAJcVDs6RbmujeyPuqaK8LFfugho</td> 
					  </tr>
					  <tr>
					    <td>Ethereum Address:</td>
					    <td>0x87357c51c98ab021708cc769965117efbfdec5f6</td> 
					  </tr>
					  <tr>
					    <td>Account Balance:</td>
					    <td>420 Ether</td> 
					  </tr>
					  <tr>
					    <td>Seller Rating:</td>
					    <td>Coming Soon!</td> 
					  </tr>
					  <tr>
					    <td>Buyer Rating:</td>
					    <td>Coming Soon!</td> 
					  </tr>
					  </tbody>
					</table>
    			</div>
    		</div>
		</div>
		</div>
		)
	}
})
module.exports = AccountContainer