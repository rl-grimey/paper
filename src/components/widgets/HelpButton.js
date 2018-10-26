import React from 'react';
import { Modal, Button, Glyphicon } from 'react-bootstrap';

export default class HelpButton extends React.Component {
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
          bsStyle="info"
          bsSize="sm"     
        >
          <Glyphicon glyph="info-sign" />
          {' '}Help
        </Button>

        <Modal 
          show={this.state.open} 
          onHide={this.handleClose}
          animation={false}
          autoFocus={true}
        >
          <Modal.Header>
            <Modal.Title>How to Read this Dashboard</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h4>Charts</h4>
              <p>Example text explainging some things</p>
              <hr/>
              <h4>Data Views</h4>
              <p>Example text explainging some things</p>
              <p>Another example of text.</p>
              <hr/>
              <h4>Tile Sizing</h4>
              <p>Example text explainging some things</p>
              <hr/>
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