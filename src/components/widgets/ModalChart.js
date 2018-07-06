import React from 'react';
import { Modal, Row, Button } from 'react-bootstrap';

export default class ModalChart extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { 
      ...props
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps) { 
    this.setState({ ...nextProps });
  }

  handleOpen() { this.setState({ open: true }); }

  handleClose() { 
    this.props.callback();
    this.setState({ open: false }); 
  }

  render() {
    return (
      <Modal
        show={this.state.open}
        onHide={this.handleClose}
        animation={false}
        autoFocus={true}
        keyboard={true}
        className={'chart-modal'}
      >
        <Modal.Header><h3>{this.props.abbrv}</h3></Modal.Header>
        <Modal.Body>
          <svg width={this.state.width} height={this.state.height}>
            {this.props.children}
          </svg>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleClose}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}