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
			loading: false,
			user: this.props.user,
			displayMar: [],
			markets: []
		};
	},

	openModal: function() {
		var addys
		if(this.user == undefined){
			var user = new MarketAPI()
			addys = user.account.getAddresses(false)
		}else{
			addys = user.account.getAddresses(true)
		}
		var opt = []
		for(var i=0; i < addys.length; i++){
			var st_i = i.toString()
			for(var z = 0; z < this.props.userData.length; z++){
				if(addys[i] == this.props.userData[z].ethaddr){
					var rand = Math.floor(Math.random()*100000000000000000)
					opt.push(<option value={addys[i]} key={rand}>{this.props.userData[z].name}</option>)
				}
			}
		}
		this.setState({
			modalIsOpen: true,
			adminopts: opt
		})
	},

	closeModal: function() {
		this.setState({modalIsOpen: false})
	},
	createMarket: function(){
		var newMarket = {}
		var newList = []
		newMarket.id = Math.floor(Math.random()*100000000000000000)
		newMarket.name = this.refs.mname.value
		newMarket.admin = this.refs.cgethaccount.value
		newMarket.description = this.refs.cdesc.value
		newMarket.filter = this.refs.crules.value
		console.log('newList before setting equal to this.state.markets before pushing markets')
		console.log(newList)
		console.log('this.state.markets before setting equal to newList')
		console.log(this.state.markets)
		newList = this.state.markets
		console.log('newList after')
		console.log(newList)
		console.log('this.state.markets after')
		console.log(this.state.markets)

		//newList.push(newMarket)
		console.log('no longer pushing newList')
		console.log(newList)
		console.log(this.state.markets)

		this.props.user.account.createMarketContract(newMarket, this.state.markets)

		this.setState({
			loading: true
		})
		var ee = this.props.user.account.getEventEmitter()
		var url = ""
    	var rows = []
    	var rand = 0
	    ee.on('marketcontract',err => {
	      if(!err && this.isMounted()){
	      	console.log('finished creating contract')
	      	swal({   
	            title: "Success!",   
	            text: 'Your market has been created',   
	            type: "info",   
	            confirmButtonText: "Close" 
          	});
	        for(var i=0; i<newList.length; i++){
	    		rand = Math.floor(Math.random()*100000000000000000)
	    		url = '/market/'+this.props.user.account.newMarketsList[i].contract
	    		rows.push(<tr key={rand}>
						    <td><Link to={url}>{this.props.user.account.newMarketsList[i].name}</Link></td>
						    <td>{this.props.user.account.newMarketsList[i].contract}</td>
						    <td>{this.props.user.account.newMarketsList[i].description}</td>  
						</tr>)
	    	}
			this.setState({
				modalIsOpen: false,
				markets: newList,
				displayMar:rows,
				loading: false
			})
	        //self.props.handleUserIcon('test')
	      }
	      if(err){
	      	console.log(err)
	      }
	    })
	    ee.on('marketcontractfail', function(){
	    	console.log('CREATING MARKET FAILED')
	    	self.setState({ 
	    		user: user,
	        	loading: false
	        })
	    })
	},
	getMarkets: function(){
		var markets = this.props.user.account.getMarkets()
	    var url = ""
    	var rows = []
    	var rand = 0
    	this.props.user.account.ee.on('markets',err => {
	      if(!err && this.isMounted()){
	      	for(var i=0; i<this.props.user.account.marketsList.length; i++){
	    		rand = Math.floor(Math.random()*100000000000000000)
	    		url = '/market/'+this.props.user.account.marketsList[i].contract
	    		rows.push(<tr key={rand}>
						    <td><Link to={url}>{this.props.user.account.marketsList[i].name}</Link></td>
						    <td>{this.props.user.account.marketsList[i].contract}</td>
						    <td>{this.props.user.account.marketsList[i].description}</td>  
						</tr>)
	    	}
			this.setState({
				displayMar:rows,
				markets: this.props.user.account.marketsList
			})
	      }
	      if(err){
	      	console.log(err)
	      }
	    })
	},
	componentDidMount: function(){	
    	//this.initialize()
    	console.log(this.props.user)
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
			                  <label>Select Admin Account</label>
			                    <select ref="cgethaccount" name="account" className="form-control">
			                      <option value="">None</option>
			                      {this.state.adminopts}
			                    </select>
			                </fieldset>
			                <fieldset className="form-group">
			                  <label htmlFor="desc">Market Description</label>
			                  <textarea ref="cdesc" name="desc" className="form-control" id="desc" ></textarea>
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
					  	{this.state.displayMar}
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