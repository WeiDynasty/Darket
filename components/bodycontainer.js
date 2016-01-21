import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'
import Modal from 'react-modal'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}

const BodyContainer = React.createClass({
	getInitialState: function() {
		return { 
			modalIsOpen: false,
			loading: true
		};
	},
	openModal: function() {
		this.setState({modalIsOpen: true});
	},
	closeModal: function() {
		this.setState({modalIsOpen: false});
	},
	createProduct: function(){
		this.setState({modalIsOpen: false});
	},
	getCategories: function(){
		var cat = 'test'
	    var url = '/market/cat/'+cat
    	var rows = []
    	
    	for(var i =0; i<18; i++){
    		var rand = Math.floor(Math.random()*100000000000000000)
/*    		if((i % 10) == 0){
    			rows.push(</tr><tr><td key={rand}><Link to={url}><h5>[{cat}]</h5></Link></td>)
    		}*/
    		rows.push(<td key={rand}><Link to={url}><h5>[{cat}]</h5></Link></td>)
    	}

    	this.setState({
    		"catrows": rows
    	})
	},
	componentDidMount: function() {
		this.getCategories()
    	// from the path `/api/search/:term`
    	const term = this.props.params.term
    	console.log(term)
	},
	render: function() {
		return (
		<div>
			<div className="row column text-center">
			<h2>Categories</h2>
			<table>
    				<tbody>
					  <tr>
					  	{this.state.catrows}
					  </tr>
					  </tbody>
			</table>
				<br/>
				<br/>
				<br/>
			</div>
			<div className="row column text-center">
				<h2>Products</h2>
			</div>
			<div className="col-md-4 col-md-offset-4">
    			<button type="button" className="btn btn-primary btn-lg btn-block" onClick={this.openModal}>Submit A New Product!</button>
    			<br/>
    		</div>
				<Modal
				isOpen={this.state.modalIsOpen}
				onRequestClose={this.closeModal}
				style={customStyles} >
					<label>Product Name</label>
					<form name="myform" ref="productCreateForm">
		                <fieldset className="form-group">
		                  <input ref="pname" name="name" type="name" className="form-control" id="exampleName" placeholder="My Awesome Product!"></input>
		                </fieldset>
		                <fieldset className="form-group">
		                  <label htmlFor="rules">Product Description</label>
		                  <textarea ref="crules" name="hobbies" className="form-control" id="rules" ></textarea>
		                </fieldset>
		                <fieldset className="form-group">
		                	<label htmlFor="quantity">Product Quantity</label>
		                	<input type="text" id="middle-label" placeholder="One fish two fish"/>
		                </fieldset>	
		                <fieldset className="form-group">
		                  <label>Select Admin Account</label>
		                    <select ref="cgethaccount" name="account" className="form-control">
		                      <option value="0">0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98</option>
		                      <option value="1">0x2a65aca4d5fc5b5c859090a6c34d164135398226</option>
		                    </select>
		                </fieldset>         
		                <fieldset className="form-group">
		                 <label htmlFor="exampleInputFile">Upload an Image</label>
		                 <input ref="cfile" name="file" type="file" className="form-control-file" id="exampleInputFile"></input>
		                </fieldset> 
		            </form>
		            <button onClick={this.createProduct}>Create!</button>

				</Modal>
			<div className="row small-up-2 large-up-4">
				<div className="column">
					<img className="thumbnail" src="http://localhost:8080/ipfs/Qma3hV1MLwSMjey2ZyaHaRP4UaKE4m9Hbc4nR8gArD3Rs4"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<Link to="/product" className="btn btn-primary btn-lg btn-block">Buy</Link>
				</div>
				<div className="column">
					<img className="thumbnail" src="http://localhost:8080/ipfs/QmS5TY4HREHXFjYuY1xnfTfNNVUC3cFNnTx2jbLsH4aJkn"/>
					<h5>Nulla At Nulla Justo, Eget</h5>
					<p>$400</p>
					<Link to="/product" className="btn btn-primary btn-lg btn-block">Buy</Link>
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
			<br></br>
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
					<h4>More Products</h4>
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
					<h4>More Products</h4>
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
					<h4>More Products</h4>
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