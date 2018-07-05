/**
 * Settings panel for our chart
 */

import React from 'react';
import { 
  Modal, 
  ModalBody, 
  ModalTitle, 
  Button, 
  Glyphicon
} from 'react-bootstrap';

export default class SettingsButton extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { open: false };
    
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.handleOpen}
          bsStyle="default"
        >
          <Glyphicon glyph="wrench" />
        </Button>

        <Modal 
          show={this.state.open} 
          onHide={this.handleClose}
          animation={false}
          autoFocus={true}
        >
          <Modal.Header>
            <Modal.Title>Chart Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h4>Community Cloud Setting</h4>
              <p>Example text explainging some things</p>

              <hr/>

              <h4>CartoGrid Settings</h4>
              <p>Hopefully an image or gif here demonstrating interactions...</p>              
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>    
    );
  }
}