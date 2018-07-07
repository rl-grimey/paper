import React from 'react';
import { Modal, Row, Button } from 'react-bootstrap';

export default class ModalChart extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { 
      ...props
    };

    this.handleOpen   = this.handleOpen.bind(this);
    this.handleClose  = this.handleClose.bind(this);
    this.render_title = this.render_title.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Only render if there's new children */
    return (
      (nextProps.children !== this.state.children) ||
      (nextProps.open !== this.state.open)
    );
  }

  componentWillReceiveProps(nextProps) { 
    this.setState({ ...nextProps });
  }

  handleOpen() { this.setState({ open: true }); }

  handleClose() { 
    this.props.callback();
    this.setState({ open: false }); 
  }

  render_title() {
    /* Creates a title depending on our chart and view. */
    let { info, view } = this.state;
    let state = info.name;

    return state + "'s Weekly Tweet Topics (Count)";
  }

  render() {
    return (
      <div className={'modal-container'} style={{height: '70vh'}}>
      <Modal
        show={this.state.open}
        //onHide={this.handleClose}\
        //container={this}
        animation={false}
        autoFocus={true}
        keyboard={true}
        className={'chart-modal'}
        aria-labelledby="contained-modal-title"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title">
            {this.render_title()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <svg width={this.state.width} height={this.state.height * 0.7}>
            {this.props.children.slice(0, 2)}
          </svg>
          {this.props.children[2]}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
  }
}