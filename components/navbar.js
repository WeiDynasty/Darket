const Navbar = React.createClass ({
  	render: function() {
		return (
		  <div>
			<nav className="navbar navbar-default">
			  <div className="container-fluid">
			  	<div className="navbar-header">
			       <Link to="/" className="navbar-brand"><img src="images/IPFS_SwarmLogo_Draft111915.svg" style={logostyle} ></img></Link>
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
module.exports = Navbar
