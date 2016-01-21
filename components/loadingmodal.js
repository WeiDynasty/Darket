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
            loading: this.props.loading
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
    render: function(){
        return (		   
			<div>
				<Modal
					isOpen={this.props.loading}
					onRequestClose={this.closeModal}
					style={customStyles} >

			            <image src={this.props.src} />
			    </Modal>

			</div>
        );
    }
});

module.exports = LoadingModal;
