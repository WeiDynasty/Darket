const HomeComponent = React.createClass({
	render: function() {
		return (
		<div>
		<div className="row">
    		<div className="text-center">
    		<h1>Welcome to the distributed marketplace. Enjoy!</h1>
    			<div className="col-md-4 col-md-offset-4">
    				<br/>
    				<br/>
    				<h4>Are you a new user?</h4>
    				<button type="button" className="btn btn-primary btn-lg btn-block">Create Account</button>
    				<br/>
    				<h4>Already have an account?</h4>
    				<button type="button" className="btn btn-secondary btn-lg btn-block">Sign In</button>
    			</div>
    		</div>
		</div>
		</div>
		);
	}
});
module.exports = HomeComponent;