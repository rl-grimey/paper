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
      <Modal
        show={this.state.open}
        onHide={this.handleClose}
        animation={false}
        autoFocus={true}
        keyboard={true}
        className={'chart-modal'}
      >
        <Modal.Header>
          <h3>{this.render_title()}</h3>
        </Modal.Header>
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