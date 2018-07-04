/* Dependencies */
import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import * as d3 from 'd3';

/* Styles */
import 'bootstrap/dist/css/bootstrap.css';
//import './style.css';

/* Components */
import { Slider, HelpButton, DataTable } from './components/widgets';
import Cartogrid from './components/Cartogrid';
import Toolbar from './components/widgets/Toolbar';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      width  : 1000,
      height : 600,
      padding: 0.15,

      chart  : 'topics',
      view   : 'absolute',
      cluster: null,
      statefp: null,
      week   : null
    }

    this.handleChartBtn = this.handleChartBtn.bind(this);
    this.handleViewBtn  = this.handleViewBtn.bind(this);
  }

  handleChartBtn(chart) {
    /* Sets our chart state based on the currently selected toolbar button. */
    this.setState({ chart });
  }

  handleViewBtn(view) {
    /* Changes our data view (either absolute or relative) */
    this.setState({ view });
  }

  render() {
    // Make sure we're updating correctly
    console.log('/* App ---------------------------------------------------*/');
    console.log(this.state);

    return (
      <div className="App">
        <Grid fluid={true}>

          {/* Title Row*/}
          <Row>
            <Col xs={11}>
              <h3 className="dashboard-title">
                <abbr 
                  title="Cartographic Topic Visualization of Immigrant-related Tweets *before* and *after* the Travel Ban."
                >CarTopicVis
                </abbr>
              </h3>
            </Col>
            <Col xs={1}>
              <h3><HelpButton/></h3>
            </Col>
          </Row>

          <Toolbar
            handleChart={this.handleChartBtn}
            handleView={this.handleViewBtn}
          />

          <hr/>

          {/* Dashboard row */}
          <Row>
            <Cartogrid
              width={this.state.width}
              height={this.state.height}
              padding={this.state.padding}
              chart={this.state.chart}
              view={this.state.view}
            />
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
