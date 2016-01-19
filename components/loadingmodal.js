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
};

var LoadingModal = React.createClass({		
	propTypes: {
		src: React.PropTypes.string,
		loading: React.PropTypes.bool,
	},
	getInitialState: function(){		
		return {
            loading: false
			}
	},
	openModal: function() {
		this.setState({
			loading: true
		});
	},

	closeModal: function() {
		this.setState({loading: false});
	},
	getDefaultProps: function() {
		return {
			src: 'images/loading1.gif'
		}
	},
	shouldComponentUpdate: function(nextProps, nextState) {
		//console.log("shouldComponentUpdate: " + nextProps.showLoading);
		if (nextProps.loading !== this.props.loading) {
			this.toggle(nextProps.loading);
			return true;
		} else {
			return false;
		}				 
	},	
	toggle: function(show) {
		if (show) {
  			this.openModal()
  		} else {
  			this.closeModal()
  		}
	},
	componentDidMount: function() {
		this.toggle(this.state.loading);		
	},
    render: function(){
        return (		   
			<div>
				<Modal
					isOpen={this.state.loading}
					onRequestClose={this.closeModal}
					style={customStyles} >

			            <image src={this.props.src} style={{marginLeft: '30px'}}/>
			    </Modal>

			</div>
        );
    }
});

module.exports = LoadingModal;
