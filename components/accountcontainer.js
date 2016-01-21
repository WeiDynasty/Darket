import React from 'react'
import MarketAPI from '../js/libraries/marketapi-wrapper'
import LoadingModalComponent from './loadingmodal'

const AccountContainer = React.createClass({
	getInitialState: function() {
	return { 
		modalCreateIsOpen: false,
		modalSignIsOpen: false,
		loading: true,
		heading: 'Checking For Account...'
	 };
	},
	initialize: function(){	   
	    var user = new MarketAPI()
	    user.account.init()
	    //example of using the netid api to get the eth balance
	    var web3test = user.account.getBalance()
	    console.log('Balance: '+web3test+' Ether')
		var self = this 
		self.setState({
			api: user
		})
	    if(!this.isMounted()) return
	    var ee = user.account.getEventEmitter()
	    ee.on('initdone',err => {
	      if(!err && this.isMounted()){
	        self.setState({ 
	        	loadingImg: "test",
	        	user: user,
	        	loading: false,
	        	heading: 'You Are Logged In!'
	        });
	        //self.props.handleUserIcon('test')
	      }
	      if(err){
	      	console.log(err)
	      }
	    })	
	},
	componentDidMount: function(){
		//this.props.test2
		//console.log(this.props.user)    	
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
    		<h1>{this.state.heading}</h1>
    		<br/>
    		<br/>
    		<h3>Profile</h3>
    			<div className="col-md-8 col-md-offset-2">
    				
						<img className="thumbnail" src="images/user.png"/>
						<fieldset className="form-group">
			                 <label htmlFor="exampleInputFile">Upload an Image</label>
			                 <div className="col-md-8 col-md-offset-4">
			                 <input ref="pfile" name="file2" type="file" className="form-control-file" id="updateProfilePic"></input>
			            	</div>
			            </fieldset>
				
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
		<LoadingModalComponent loading={this.state.loading}/>
		</div>
		)
	}
})
module.exports = AccountContainer