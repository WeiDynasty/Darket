import MarketAPI from '../js/libraries/marketapi-wrapper'
import CreateModal from './createmodal'
import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import Modal from 'react-modal'
import LoadingModalComponent from './loadingmodal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const HomeComponent = React.createClass({
	getInitialState: function() {
	return { 
		modalCreateIsOpen: false,
		modalSignIsOpen: false,
		loading: false
		//user: this.props.user
	 };
	},

	openCreateModal: function() {
	//this.initialize()
		this.setState({
			modalCreateIsOpen: true,
			showLoading: false
		});
	},
	openSignModal: function() {
		this.setState({
			modalSignIsOpen: true,
			showLoading: false
		});
	},
	closeSignModal: function() {
		this.setState({
			modalSignIsOpen: false
		});
	},
	closeCreateModal: function() {
		this.setState({
			modalCreateIsOpen: false
		});
	},
	createAccount: function(){
		this.setState({
			modalCreateIsOpen: false,
			loading: true
		})
		this.initialize()
		console.log(this.refs.cname.value)
		console.log('from createAccount() '+this.state.user)
	},
	signIn: function(){
		this.setState({modalSignIsOpen: false})
	},
	initialize: function(){    
	    var user = new MarketAPI()
	    user.account.init()
	    //example of using the netid api to get the eth balance
	    var web3test = user.account.getBalance()
	    console.log('Balance: '+web3test+' Ether')
		var self = this 
		console.log('from init function: '+self.props.user)
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
	        	//loadingImg: "test",
	        	user: user,
	        	loading: false
	        });
	      }
	    })
	    ee.on('initerr',err => {
	      if(this.isMounted()){
	        self.setState({ 
	        	loading: false
	        });
	      }
	    })	
	},
	render: function() {
		return (
		<div>
		<div className="row">
    		<div className="text-center">
    		<h1>Welcome to the distributed marketplace!</h1>
    			<div className="col-md-4 col-md-offset-4">
    				<br/>
    				<br/>
    				<h4>Are you a new user?</h4>
    				<button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.openCreateModal}>Create Account</button>
					<Modal
					isOpen={this.state.modalCreateIsOpen}
					onRequestClose={this.closeCreateModal}
					style={customStyles} >
						<div className="text-center">Create New Account</div>
						<br/>
						<label>Select Name</label>
						<form name="myform" ref="personaCreateForm">
			                <fieldset className="form-group">
			                  <input ref="cname" name="name" type="name" className="form-control" id="exampleName" placeholder="Persona Name"></input>
			                </fieldset>
			                <fieldset className="form-group">
			                	<label>Enter Password</label>
			                  <input ref="cpass" name="pass" type="password" className="form-control" id="examplePass" placeholder="Password"></input>
			                </fieldset>
			                <fieldset className="form-group">
			                	<label>Enter Password Again</label>
			                  <input ref="cpass2" name="pass2" type="password" className="form-control" id="examplePass2" placeholder="Re-enter Password"></input>
			                </fieldset>
			                <fieldset className="form-group ">
			                  <label>Persona Type</label>
			                    <select ref="ctype" name="personaType" className="form-control">
			                      <option>Buyer</option>
			                      <option>Seller</option>
			                    </select>
			                </fieldset>
			            </form>
			            <button onClick={this.createAccount}>Create!</button>

					</Modal>

    				<p className="text-danger">This will publish new data to IPNS!</p>
    				<br/>
    				<h4>Already have an account?</h4>

    				<button type="button" className="btn btn-secondary btn-lg btn-block" onClick={this.openSignModal}>Sign In</button>
    					<Modal
						isOpen={this.state.modalSignIsOpen}
						onRequestClose={this.closeSignModal}
						style={customStyles} >
						<form name="myform" ref="personaCreateForm">	               
			                <fieldset className="form-group">
			                  <label>Select Account</label>
			                    <select ref="cgethaccount" name="account" className="form-control">
			                      <option value="0">0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98</option>
			                      <option value="1">0x2a65aca4d5fc5b5c859090a6c34d164135398226</option>
			                    </select>
			                </fieldset>
			                <fieldset className="form-group">
			                	<label>Enter Password</label>
			                  <input ref="cpass" name="pass" type="password" className="form-control" id="examplePass" placeholder="Password"></input>
			                </fieldset>
			            </form>
			            <Link to="/markets"><button onClick={this.signIn}>Sign In!</button></Link>

					</Modal>
    				<p>In the future you will have more sign in options. Multiple personas based on multiple IPFS IDs and Ethereum accounts are in the works.
    				   Currently defaults to your go-ipfs client ID and geth account 0</p>
    			</div>
    		</div>
		</div>
		<div className="row">
		<div className="text-center">
    			<br/>
    			<br/>
    			<br/>
    			<h1>About</h1>
    			<p>The echo chambers of the Internet reverberate to many opinions, but attempts to find a precise meaning seem to find a dismaying lack of agreement. To be anything more than marketing hyperbole we really need the answers some questions. What is it? What isn't it? What might it be? Can it be something that will allow us to build new and enduring systems? In short, what is the essence of blockchain?
    			</p>
    		</div>
    		</div>
    		<LoadingModalComponent loading={this.state.loading}/>
		</div>
		);
	}
});
module.exports = HomeComponent;

