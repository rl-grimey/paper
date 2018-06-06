import React from 'react';
import { 
  Modal, 
  ModalBody, 
  ModalTitle, 
  Button, 
  Glyphicon 
} from 'react-bootstrap';

export class Slider extends React.Component {
  render() {
    return (
      <fieldset>
        <span>
          <label htmlFor={this.props.name}>{this.props.label}</label>
          <span>&nbsp;</span>
          <input 
            type={"range"}
            name={this.props.name}
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
            step={this.props.step}
            onChange={this.props.onChange}
          />
        </span>
      </fieldset>
    );
  }
}

export class HelpButton extends React.Component {
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
          bsStyle="primary"
        >
          <Glyphicon glyph="info-sign" />
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
              <h4>Heading 4</h4>
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