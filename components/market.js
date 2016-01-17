import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import HomeComponent from'./homecontainer'
import BodyContainer from './bodycontainer'
import AccountContainer from './accountcontainer'
import MarketAPI from '../js/libraries/marketapi-wrapper'

var App = React.createClass ({
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
	  	var logostyle = {
	      height: '50px',
	      marginLeft: '-30px',
	      marginRight: '80px',
	      marginTop: '3px'
	    }
	    var headerstyle = {
	      marginLeft: '-70px'
	    }
	    var rightStyle = {
	    	marginRight: '40px',
	    	marginTop: '-12px'
	    }
	    var userStyle = {
	    	width: '40px'
	    }
	    //TODO: Maybe add boolen check to switch the logo color to a bright color if the api finds your user on landing so you know you are logged in.
	    return (
		  <div>
			<nav className="navbar navbar-default">
			  <div className="container-fluid">
			  	<div className="nav navbar-nav">
			       <Link to="/"><img src="images/IPFS_SwarmLogo_Draft111915.svg" style={logostyle} ></img></Link>
			    </div>
			    <div style={headerstyle} className="navbar-header">
			      <Link to="/" className="navbar-brand">IPFS Market</Link>
			    </div>
			    <ul className="nav navbar-nav">
			      <li><Link to="/">Home</Link></li>
			      <li><Link to="/markets">Markets</Link></li> 
			      <li><a href="https://github.com/WeiDynasty/Market-Dapp">Github</a></li>
			    </ul>
			    <ul className="navbar-brand navbar-right" style={rightStyle}>
			    	<Link to="/account" className="navbar-right"><img src="images/user.png" style={userStyle}></img></Link>
			    </ul>
			  </div>
			</nav>
			{this.props.children}
		  </div>
	    )
	}
})

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomeComponent}/>
      <Route path="/markets" component={BodyContainer}/>
      <Route path="/account" component={AccountContainer}/>
    </Route>
  </Router>
), document.getElementById('content'))
