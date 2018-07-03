import React from 'react';
import { 
  Modal, 
  ModalBody, 
  ModalTitle, 
  Button, 
  Glyphicon,
  Table
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

export class DataTable extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      state: props.abbrv,
      cluster: props.cluster,
      data: props.data
    };
  }
  /*shouldComponentUpdate(nextProps, nextState) {
    console.log('update request fired: ', nextProps)
    let sameState = nextProps.abbrv !== this.state.state;
    let sameCluster = nextProps.cluster !== this.state.cluster;
    return sameState || sameCluster; 
  }*/

  componentWillReceiveProps(props) {
    this.setState({
      state: props.abbrv,
      cluster: props.cluster,
      data: props.data
    });
  }

  createTitle = (cluster, state) => {
    let titleBase = 'Tweets ';
    let titleCluster = (cluster === undefined) ? '' : 'Cluster '+cluster + ' ';
    let titleState = (state === undefined) ? '' : 'from ' +state;

    if ((cluster === undefined) && (state === undefined)) {
      return titleBase + '(random)';
    } else if (cluster === undefined) {
      return titleBase + titleState;
    } else if (state === undefined) {
      return titleCluster + titleBase;
    } else {
      return titleCluster +titleBase + titleState;
    }
  }

  createRow = (d, i) => {
    return (
      <tr key={i}>
        <td>{d.message}</td>
        <td>{d.cluster}</td>
        <td>{d.polarity}</td>
      </tr>
    );
  }

  render() {

    let { cluster, abbrv, data } = this.props;

    // Title creation
    let title = this.createTitle(cluster, abbrv);
    

    return (
      <div className="table-wrapper">
        <h5>{title}</h5>
        <Table condensed hover>
          <thead>
            <tr>
              <th>Message</th>
              <th>Cluster</th>
              <th>Polarity</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data
              .filter(d => d !== undefined)
              .map((d, i) => this.createRow(d, i))}
          </tbody>
        </Table>
      </div>
    );
  }
}