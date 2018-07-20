import React from 'react';
import { Modal, Row, Button, Glyphicon } from 'react-bootstrap';

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

  componentWillReceiveProps(nextProps) { this.setState({ ...nextProps }) }

  handleOpen() { this.setState({ open: true }); }

  handleClose() { 
    this.props.callback();
    this.setState({ open: false }); 
  }

  render_title() {
    /* Creates a title depending on our chart and view. */
    let { info, view } = this.state;
    let state = info.name;
    let desc = (view === 'absolute') ? 'Count' : '% Contribution';

    return state + "'s Weekly Tweet Topics (" + desc + ")";
  }

  render() {
    return (
      <div className={'modal-container'} style={{height: '70vh'}}>
        <Modal
          show={this.state.open}
          animation={false}
          autoFocus={true}
          keyboard={true}
          className={'chart-modal'}
          //dialogClassName={'chart-modal-custom'}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header >
            <Modal.Title>
              {this.render_title()}
              <Button 
                onClick={this.handleClose}
                className='pull-right'
              ><Glyphicon glyph='resize-small'/></Button>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <svg width={this.state.width} height={this.state.height }>
              {this.props.children.slice(0, 3)}
            </svg>
            {this.props.children.slice(3)}
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}