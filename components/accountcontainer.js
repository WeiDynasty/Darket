import React from 'react'
import MarketAPI from '../js/libraries/marketapi-wrapper'
import LoadingModalComponent from './loadingmodal'

const AccountContainer = React.createClass({
	getInitialState: function() {
	return { 
		modalCreateIsOpen: false,
		modalSignIsOpen: false,
		loading: false,
		heading: 'Checking For Account...',
		user: this.props.user,
		userData: this.props.userData,
		activeUserData: {}
	 };
	},
	initialize: function(){
		var addr = this.props.user.account.getActiveAddr(this.props.user.eth)
	    for(var i = 0; i < this.props.userData.length; i++){
	    	if(this.props.userData[i].ethaddr == addr){
	    		this.setState({
	    			activeUserData: this.props.userData[i],
	    			heading: 'Account Found!'
	    		})
	    	}
	    }
		var self = this
	    if(!this.isMounted()) return
	    var ee = self.state.user.account.getEventEmitter()
	    ee.on('initdone',err => {
	      if(!err && self.isMounted()){
	        self.setState({ 
	        	loadingImg: "test",
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
	    var imgstyle = {
	    	width: '250px',
	    	height: '250px'
	    }
	    var image = "http://localhost:8080"+this.state.activeUserData.img
		return (
		<div>
		<div className="row">
    		<div className="text-center">
    		<h1>{this.state.heading}</h1>
    		<br/>
    		<br/>
    		<h3>Profile</h3>
    			<div className="col-md-8 col-md-offset-2">
    				
						<img className="thumbnail" style={imgstyle} src={image}/>
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
					    <td>{this.state.activeUserData.name}</td> 
					  </tr>
					  <tr>
					    <td>IPFS ID:</td>
					    <td>{this.state.user.account.id}</td> 
					  </tr>
					  <tr>
					    <td>Ethereum Address:</td>
					    <td>{this.state.activeUserData.ethaddr}</td> 
					  </tr>
					  <tr>
					    <td>Account Balance:</td>
					    <td>{this.state.user.account.getBalance(this.state.activeUserData.ethaddr)} Ether</td> 
					  </tr>
					  <tr>
					    <td>Account Type:</td>
					    <td>{this.state.activeUserData.type}</td> 
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