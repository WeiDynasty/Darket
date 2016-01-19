import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
const BodyContainer = React.createClass({
	render: function() {
		return (
		<div>
			<div className="row column text-center">
				<h2>View once in a market</h2>
				<hr/>
			</div>
			<div className="row small-up-2 large-up-4">
				<div className="column">
					<img className="thumbnail" src="http:localhost:8080/ipfs/Qma3hV1MLwSMjey2ZyaHaRP4UaKE4m9Hbc4nR8gArD3Rs4"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<Link to="/product" className="btn btn-primary btn-lg btn-block">Buy</Link>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://localhost:8080/ipfs/QmS5TY4HREHXFjYuY1xnfTfNNVUC3cFNnTx2jbLsH4aJkn"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="btn btn-primary btn-lg btn-block">Buy</a>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="btn btn-primary btn-lg btn-block">Buy</a>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="btn btn-primary btn-lg btn-block">Buy</a>
				</div>
			</div>
			<hr/>
			<div className="row column">
				<div className="callout primary">
					<h3>Really big special this week on items.</h3>
				</div>
			</div>
			<hr/>
			<div className="row column text-center">
				<h2>Some Other Neat Products</h2>
				<hr/>
			</div>
			<div className="row small-up-2 medium-up-3 large-up-6">
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="button small expanded hollow">Buy</a>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="button small expanded hollow">Buy</a>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="button small expanded hollow">Buy</a>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="button small expanded hollow">Buy</a>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="button small expanded hollow">Buy</a>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://placehold.it/300x400"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<a href="#" className="button small expanded hollow">Buy</a>
				</div>
			</div>
			<hr/>
			<div className="row">
				<div className="medium-4 columns">
					<h4>Top Products</h4>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
				</div>
				<div className="medium-4 columns">
					<h4>Top Products</h4>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
				</div>
				<div className="medium-4 columns">
					<h4>Top Products</h4>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
					<div className="media-object">
						<div className="media-object-section">
							<img className="thumbnail" src="http://placehold.it/100x100"/>
						</div>
						<div className="media-object-section">
							<h5>Nunc Eu Ullamcorper Orci</h5>
							<p>Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque.</p>
						</div>
					</div>
				</div>
			</div>
			<div className="callout large secondary">
				<div className="row">
					<div className="large-12 columns">
						<h5>Vivamus Hendrerit Arcu Sed Erat Molestie</h5>
						<p>Curabitur vulputate, ligula lacinia scelerisque tempor, lacus lacus ornare ante, ac egestas est urna sit amet arcu. className aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed molestie augue sit.</p>
					</div>
				</div>
			</div>
		</div>
		);
	}
});
module.exports = BodyContainer;