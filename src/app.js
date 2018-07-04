/* Dependencies */
import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import * as d3 from 'd3';

/* Styles */
import 'bootstrap/dist/css/bootstrap.css';
//import './style.css';

/* Components */
//import { loadData } from './utilities';
import { Slider, HelpButton, DataTable } from './components/widgets';
import Cartogrid from './components/Cartogrid';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      width  : 1000,
      height : 600,
      padding: 0.2,

      chart  : 'counts',
      cluster: null,
      statefp: null,
      week   : null
    }
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

          <hr/>

          {/* Dashboard row */}
          <Row>
            <Cartogrid
              width={this.state.width}
              height={this.state.height}
              padding={this.state.padding}
              chart={this.state.chart}
            />
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
