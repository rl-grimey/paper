/**
 * Chart Toolbar -- Buttons to switch chart and data representation
 */

import React from 'react';
import { Row, Col, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import HelpButton from './HelpButton';
import { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } from 'constants';

export default class Toolbar extends React.Component {
  constructor(props) {
    super();
    this.state = {
      chart: props.chart,
      view : props.view,
      tile : props.tile
    }

    this.handleChartBtn = this.handleChartBtn.bind(this);
    this.handleViewBtn  = this.handleViewBtn.bind(this);
    this.handleTileBtn  = this.handleTileBtn.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
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

  handleTileBtn(evt) {
    /* Sets our tile sizing button. */
    this.setState({ tile: evt });
    this.props.handleTile(evt);
  }

  handleDownload() {
    /* Downloads our chart's as a PNG */
    let fig_div = document.querySelector('#figureDiv'); 
    console.log(fig_div);

  }

  render() {
    return (
      <Row className={'justify-content-between'}>

        <Col>
          <h2 className="dashboard-title align-middle">
            <abbr 
              title="Cartographic Topic Visualization of Immigrant-related Tweets *before* and *after* the 2017 Muslim Travel Ban."
            >CarSentoGram
            </abbr>
          </h2>
        </Col>

        <Col>
          <ButtonToolbar style={{'marginTop': '20px'}}>
            <ToggleButtonGroup 
              type="radio" 
              name="charts"
              value={this.state.chart}
              defaultValue={'topics'}
              onChange={(evt) => this.handleChartBtn(evt)}
            >
              <ToggleButton disabled value={''}><b>Charts</b></ToggleButton>
              <ToggleButton value={'topics'}>Topic View</ToggleButton>
              <ToggleButton value={'sents'}>Sentiment View</ToggleButton>
              <ToggleButton value={'counts'}>Distribution View</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </Col>

        <Col>
          <ButtonToolbar style={{'marginTop': '20px'}}>
            <ToggleButtonGroup 
              type="radio" 
              name="views"
              value={this.state.view}
              defaultValue={'absolute'}
              onChange={(evt) => this.handleViewBtn(evt)}
            >
              <ToggleButton disabled value={''}><b>Data View</b></ToggleButton>
              <ToggleButton value={'absolute'}>Absolute</ToggleButton>
              <ToggleButton value={'relative'}>Relative</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </Col>

        <Col>
          <ButtonToolbar style={{'marginTop': '20px'}}>
            <ToggleButtonGroup 
              type="radio" 
              name="tiles"
              value={this.state.tile}
              defaultValue={'total_tweets'}
              onChange={(evt) => this.handleTileBtn(evt)}
            >
              <ToggleButton disabled value={''}><b>Tile Sizing</b></ToggleButton>
              <ToggleButton value={'total_tweets'}>Tweets</ToggleButton>
              <ToggleButton value={'pop17'}>Population</ToggleButton>
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