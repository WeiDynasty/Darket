import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import MarketAPI from '../js/libraries/marketapi-wrapper'
import HomeComponent from'./homecontainer'
import BodyContainer from './bodycontainer'
import AccountContainer from './accountcontainer'
import ProductContainer from './productcontainer'
import MarketsContainer from './marketscontainer'
import LoadingModalComponent from './loadingmodal'


var App = React.createClass ({
	getInitialState: function() {
		return {
			loading: true,
			loadingImg: 'images/user.png',
			user: {},
			userData: [],
			ee: {}
		}
	},
	initialize: function(){	    
	    var user = new MarketAPI()
	    user.account.init()
	    //example of using the netid api to get the eth balance
		var self = this 
	    if(!this.isMounted()) return
	    var ee = user.account.getEventEmitter()
	    ee.on('initdone',err => {
	      if(!err && this.isMounted()){
	      	var userObj = user.account.userObj
	      	console.log('finished initializing api')
	      	swal({   
	            title: "Success!",   
	            text: 'You are now signed in and ready to use the markets',   
	            type: "info",   
	            confirmButtonText: "Close" 
          	});
	        self.setState({ 
	        	loadingImg: "images/userblue.png",
	        	user: user,
	        	loading: false,
	        	ee: ee,
	        	userData: userObj
	        });
	        //self.props.handleUserIcon('test')
	      }
	      if(err){
	      	console.log(err)
	      }
	    })
	    ee.on('initfail', function(){
	    	self.setState({ 
	    		user: user,
	        	loading: false
	        })
	    })	
	},
	componentDidMount: function(){	
    	this.initialize()
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
	    //var test = this.test()
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
			    	<Link to="/account" className="navbar-right"><img src={this.state.loadingImg} style={userStyle}></img></Link>
			    </ul>
			    <ul className="navbar-brand navbar-right" style={rightStyle}>
			    	<form className="navbar-form" role="search">
					<div className="input-group">
						<input type="text" className="form-control" placeholder="Coming Soon!" name="srch-term" id="srch-term"/>
						<div className="input-group-btn">
							<button className="btn btn-default" type="submit">Search</button>
						</div>
					</div>
					</form>
				</ul>
			  </div>
			</nav>
			{React.cloneElement(this.props.children, {user: this.state.user, ee: this.state.ee, userData: this.state.userData, activeAccount: this.state.activeAccount, test: 'testing more data'})}
			<LoadingModalComponent loading={this.state.loading}/>
		  </div>
	    )
	}
})

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomeComponent}/>
      <Route path="/market/:term" component={BodyContainer}/>
      <Route path="/account" component={AccountContainer}/>
      <Route path="/product/:pterm" component ={ProductContainer}/>
      <Route path="/markets" component ={MarketsContainer}/>
    </Route>
  </Router>
), document.getElementById('content'))

