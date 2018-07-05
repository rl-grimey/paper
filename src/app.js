/* Dependencies */
import React from 'react';
import { Grid, Col, Row, ButtonGroup } from 'react-bootstrap';

/* Styles */
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import { center_styles } from './utilities';

/* Components */
import HelpButton from './components/widgets/HelpButton';
import SettingsButton from './components/widgets/SettingsButton';

import Cartogrid from './components/Cartogrid';
import CommunityGrid from './components/Communitygrid';
import Toolbar from './components/widgets/Toolbar';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      width  : 1000,
      height : 600,
      padding: 0.15,

      chart    : 'topics',
      view     : 'absolute',
      community: null,
      statefp  : null,
      week     : null
    }

    this.handleChartBtn = this.handleChartBtn.bind(this);
    this.handleViewBtn  = this.handleViewBtn.bind(this);
  }

  componentDidMount() {
    /* Adjust width to maximum possible after the component mounts. */
    let app_div = document.querySelector('#app_ref');
    let width = app_div.clientWidth;
    this.setState({ width: width });
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
        <Grid fluid={true} id="app_ref">

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
              <Row>
                <HelpButton/>
                <SettingsButton/>
              </Row>
            </Col>
          </Row>

          <Toolbar
            handleChart={this.handleChartBtn}
            handleView={this.handleViewBtn}
          />

          <hr/>

          {/* Dashboard row */}
          <CommunityGrid
            width={this.state.width}
            height={this.state.height / 4}
            community={this.state.community}
            view={this.state.view}
          />

          <Row style={center_styles}>
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
