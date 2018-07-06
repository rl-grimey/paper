/**
 * Chart Toolbar -- Buttons to switch chart and data representation
 */

import React from 'react';
import { Row, Col, ButtonToolbar, ToggleButtonGroup, ToggleButton, Label } from 'react-bootstrap';
import HelpButton from './HelpButton';

export default class Toolbar extends React.Component {
  constructor(props) {
    super();
    this.state = {
      chart: props.chart,
      view: props.view
    }

    this.handleChartBtn = this.handleChartBtn.bind(this);
    this.handleViewBtn  = this.handleViewBtn.bind(this);
  }

  handleChartBtn(evt) {
    /* Handles a button click event to set the chart in our state and pass up*/
    this.setState({ chart: evt });
    this.props.handleChart(evt);
  }

  handleViewBtn(evt) {
    /* Handles a button click event, setting the 'view' attr in the toolbar 
     * as well as setting our app's view to pass back to the cartogrid.
     */
    this.setState({ view: evt });
    this.props.handleView(evt);
  }

  render() {
    return (
      <Row className={'justify-content-between'}>

        <Col>
          <h2 className="dashboard-title align-middle">
            <abbr 
              title="Cartographic Topic Visualization of Immigrant-related Tweets *before* and *after* the Travel Ban."
            >CarTopicVis
            </abbr>
          </h2>
        </Col>

        <Col>
          <ButtonToolbar style={{'marginTop': '20px'}}>
            <Label 
              bsStyle="default"
              style={{'lineHeight': '3'}}
            >Charts
            </Label>{' '}
            <ToggleButtonGroup 
              type="radio" 
              name="charts"
              value={this.state.chart}
              defaultValue={'topics'}
              onChange={(evt) => this.handleChartBtn(evt)}
            >
              <ToggleButton value={'topics'}>Topic View</ToggleButton>
              <ToggleButton value={'sents'}>Sentiment View</ToggleButton>
              <ToggleButton value={'counts'}>Distribution View</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </Col>

        <Col>
          <ButtonToolbar style={{'marginTop': '20px'}}>
            <Label bsStyle="default" style={{'lineHeight': '3'}}>Data View</Label>{' '}
            <ToggleButtonGroup 
              type="radio" 
              name="views"
              value={this.state.view}
              defaultValue={'absolute'}
              onChange={(evt) => this.handleViewBtn(evt)}
            >
              <ToggleButton value={'absolute'}>Absolute</ToggleButton>
              <ToggleButton value={'relative'}>Relative</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </Col>

        <Col>
          <HelpButton />
        </Col>
      </Row>
    );
  }
}