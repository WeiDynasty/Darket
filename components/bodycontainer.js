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
}

const BodyContainer = React.createClass({
	getInitialState: function() {
			console.log(this.props.user)
		return { 
			modalIsOpen: false,
			displayProd: [],
			prodsList: [],
			catrows: []
		};
	},
	openModal: function() {
		this.setState({modalIsOpen: true});
	},
	closeModal: function() {
		this.setState({modalIsOpen: false});
	},
	createProduct: function(){
	    var url = ""
    	var rows = []
		var self = this
		var newProduct = {
			id: "",
			name: "",
			price: "",
			description: "",
			category: "",
			contract: "",
			quantity: "",
			img: "/ipfs/Qma3hV1MLwSMjey2ZyaHaRP4UaKE4m9Hbc4nR8gArD3Rs4"
		}
		newProduct.id = Math.floor(Math.random()*100000000000000000)
		newProduct.name = self.refs.pname.value
		newProduct.description = self.refs.pdesc.value
		newProduct.category = self.refs.pcat.value
		newProduct.quantity = self.refs.pquant.value
		newProduct.price = self.refs.pprice.value

		console.log(newProduct)

		self.props.user.account.createProductContract(newProduct, self.state.prodsList, self.props.params.term, self.refs.pprice.value)

		self.setState({
			loading: true
		})
		//not working
		var ee = self.props.user.account.getEventEmitter()
		ee.on('productcontract',err => {
	      	if(!err && self.isMounted()){
		      	console.log('finished creating product')
		      	swal({   
		            title: "Success!",   
		            text: 'Your product has been created',   
		            type: "info",   
		            confirmButtonText: "Close" 
	          	});
		        for(var i=0; i<self.props.user.account.newProductsList.length; i++){
		    		var rand = Math.floor(Math.random()*100000000000000000)
		    		url = '/product/'+self.props.user.account.newProductsList[i].contract
		    		rows.push(<div className="column" key={rand}>
						<img className="thumbnail" src="http://localhost:8080/ipfs/Qma3hV1MLwSMjey2ZyaHaRP4UaKE4m9Hbc4nR8gArD3Rs4"/>
						<h5>{self.props.user.account.newProductsList[i].description}</h5>
						<p>{self.props.user.account.newProductsList[i].price}</p>
						<Link to={url} className="btn btn-primary btn-lg btn-block">Buy</Link>
					</div>)
		    	}
				self.setState({
					modalIsOpen: false,
					displayProd: rows,
					prodsList: self.props.user.account.newProductsList,
					loading: false
				})
			}
		})
	},
	getCategories: function(){
		var cat = ""
	    var url = '/market/cat/'+cat
    	var rows = []
    	console.log(this.state.prodsList)
    	for(var i =0; i<this.state.prodsList.length; i++){
    		var rand = Math.floor(Math.random()*100000000000000000)
/*    		if((i % 10) == 0){
    			rows.push(</tr><tr><td key={rand}><Link to={url}><h5>[{cat}]</h5></Link></td>)
    		}*/
    		rows.push(<td key={rand}><Link to={url}><h5>[{this.state.prodsList[i].category}]</h5></Link></td>)
    	}

    	this.setState({
    		catrows: rows
    	})
	},
	getProducts: function(){
		var url = ""
		var url2 = ""
    	var rows = []
    	var rows2 = []
    	var rand = 0
		this.props.user.account.getProducts(this.props.params.term)

		this.props.user.account.ee.on('products',err => {
	      if(!err && this.isMounted()){
	      	for(var i=0; i<this.props.user.account.productsList.length; i++){
	    		rand = Math.floor(Math.random()*100000000000000000)
	    		url = '/product/'+this.props.user.account.productsList[i].id
	    		url2 = '/product/cat/'+this.props.user.account.productsList[i].category

	    		rows.push(<div className="column" key={rand}>
					<img className="thumbnail" src="http://localhost:8080/ipfs/Qma3hV1MLwSMjey2ZyaHaRP4UaKE4m9Hbc4nR8gArD3Rs4"/>
					<h5>{this.props.user.account.productsList[i].description}</h5>
					<p>{this.props.user.account.productsList[i].price}</p>
					<Link to={url} className="btn btn-primary btn-lg btn-block">Buy</Link>
				</div>)

				rows2.push(<td key={rand}><Link to={url2}><h5>[{this.props.user.account.productsList[i].category}]</h5></Link></td>)
			}	
			this.setState({
				displayProd:rows,
				catrows: rows2,
				prodsList: this.props.user.account.productsList
			})
	      }
	      if(err){
	      	console.log(err)
	      }
	    })
	},
	componentDidMount: function() {
		this.getProducts()
		//this.getCategories()
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
		                  <textarea ref="pdesc" name="desc" className="form-control" id="desc" ></textarea>
		                </fieldset>
		                <fieldset className="form-group">
		                	<label htmlFor="category">Category</label>
		                	<input ref="pcat" type="text" id="middle-label" placeholder="Stuff"/>
		                </fieldset>
		                <fieldset className="form-group">
		                	<label htmlFor="price">Price</label>
		                	<input ref="pprice" type="number" id="middle-label" placeholder="Stuff"/>
		                </fieldset>
		                <fieldset className="form-group">
		                	<label htmlFor="quantity">Product Quantity</label>
		                	<input ref="pquant" type="text" id="middle-label" placeholder="One fish two fish"/>
		                </fieldset>	         
		                <fieldset className="form-group">
		                 <label htmlFor="exampleInputFile">Upload an Image</label>
		                 <input ref="cfile" name="file" type="file" className="form-control-file" id="exampleInputFile"></input>
		                </fieldset> 
		            </form>
		            <button onClick={this.createProduct}>Create!</button>

				</Modal>
			<div className="row small-up-2 large-up-4">
				{this.state.displayProd}
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
			<LoadingModalComponent loading={this.state.loading}/>
		</div>
		);
	}
});
module.exports = BodyContainer;