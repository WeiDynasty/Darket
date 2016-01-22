import MarketAPI from '../js/libraries/marketapi-wrapper'
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

const MarketsComponent = React.createClass({
	getInitialState: function() {
		return { 
			modalIsOpen: false,
			loading: true
		};
	},

	openModal: function() {
		this.setState({modalIsOpen: true})
	},

	closeModal: function() {
		this.setState({modalIsOpen: false})
	},
	createMarket: function(){
		console.log(this.refs.mname.value)
		this.setState({modalIsOpen: false})
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
	      	console.log('finished initializing api')
	      	swal({   
	            title: "Success!",   
	            text: 'You are now signed in and ready to use the markets',   
	            type: "info",   
	            confirmButtonText: "Close" 
          	});
	        self.setState({ 
	        	"loadingImg": "test",
	        	"user": user,
	        	loading: false
	        });
	        //self.props.handleUserIcon('test')
	      }
	      if(err){
	      	console.log(err)
	      }
	    })	
	},
	getMarkets: function(){
		var addr = '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98'
		var marAddr = addr
	    var url = '/market/'+marAddr
    	var rows = []
    	var rand = Math.floor(Math.random()*100000000000000000)
    	rows.push(<tr key={rand}>
					    <td><Link to={url}>Voxelot's Spacelab</Link></td>
					    <td>0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98</td>
					    <td>This is THE place for all of your warp drive engine parts and repairs, probing equipment, and much more!</td>  
					</tr>)
		this.setState({
			"displayRows":rows
		})
	},
	componentDidMount: function(){
		const accountNum = this.props.params.account 	
    	this.initialize()
    	this.getMarkets()
    },
	render: function() {
		var tablestyle = {
			width:'100%'
	    }
		return (
		<div>
			<div className="row">
    		<div className="text-center">
    		<h1>Markets</h1>
    		<br/>
    		<div className="col-md-4 col-md-offset-4">
    				<button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.openModal}>Create A New Market!</button>
    		</div>
					<Modal
					isOpen={this.state.modalIsOpen}
					onRequestClose={this.closeModal}
					style={customStyles} >
						<label>Market Name</label>
						<form name="myform" ref="marketCreateForm">
			                <fieldset className="form-group">
			                  <input ref="mname" name="name" type="name" className="form-control" id="exampleName" placeholder="My New Market!"></input>
			                </fieldset>
			                <fieldset className="form-group">
			                  <label>Select Public Market?</label>
			                    <select ref="cgethaccount" name="account" className="form-control">
			                      <option value="true">True</option>
			                      <option value="false">False</option>
			                    </select>
			                </fieldset>
			                <fieldset className="form-group">
			                  <label>Select Admin Account</label>
			                    <select ref="cgethaccount" name="account" className="form-control">
			                      <option value="">None</option>
			                      <option value="0">0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98</option>
			                      <option value="1">0x2a65aca4d5fc5b5c859090a6c34d164135398226</option>
			                    </select>
			                </fieldset>
			              	<fieldset className="form-group">
			                  <label htmlFor="rules">Market Rules</label>
			                  <p>Separated by commas, products containing these key words will be filtered out.</p>
			                  <textarea ref="crules" name="hobbies" className="form-control" id="rules" ></textarea>
			                </fieldset>         
			                <fieldset className="form-group">
			                 <label htmlFor="exampleInputFile">Upload an Image</label>
			                 <input ref="cfile" name="file" type="file" className="form-control-file" id="exampleInputFile"></input>
			                </fieldset> 
			            </form>
			            <button onClick={this.createMarket}>Create!</button>

					</Modal>
	
    			<div className="col-md-10 col-md-offset-1">
    				<br/>
    				<br/>
    				<h3>Click the market name to enter!</h3>
    				<br/>
    				<br/>
    				<table style={tablestyle}>
    				<tbody>
					  <tr>
					    <td>Market Name</td>
					    <td>Market Address</td>
					    <td>Description</td> 
					  </tr>
					  	{this.state.displayRows}
					  </tbody>
					</table>
    			</div>
    		</div>
		</div>
		<LoadingModalComponent loading={this.state.loading}/>
		</div>
		);
	}
});
module.exports = MarketsComponent;