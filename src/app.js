/* Dependencies */
import React from 'react';
import { Grid, Row } from 'react-bootstrap';

/* Styles */
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import { center_styles } from './utilities';

/* Components */
import TitleRow from './components/TitleRow';
import Toolbar from './components/widgets/Toolbar';
import CommunityGrid from './components/Communitygrid';
import Cartogrid from './components/Cartogrid';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      width  : 1000,
      height : 600,
      padding: 0.05,

      chart    : 'topics',
      view     : 'absolute',
      community: null,
      statefp  : null,
      week     : null
    }

    this.handleBtnChart   = this.handleBtnChart.bind(this);
    this.handleBtnView    = this.handleBtnView.bind(this);
    this.handleClickTile  = this.handleClickTile.bind(this);
    this.handleClickCloud = this.handleClickCloud.bind(this);
  }

  componentDidMount() {
    /* Adjust width to maximum possible after the component mounts. */
    let app_div = document.querySelector('#app_ref');
    let width = app_div.clientWidth;
    this.setState({ width: width });
  }

  handleBtnChart(chart) {
    /* Sets our chart state based on the currently selected toolbar button. */
    this.setState({ chart });
  }

  handleBtnView(view) {
    /* Changes our data view (either absolute or relative) */
    this.setState({ view });
  }

  handleClickTile(state) {
    /* Assigns the clicked state Gridtile as app statefp */
    this.setState({ statefp: state });
  }

  handleClickCloud(community) {
    /* Assigns the clicked community cloud. */
    //console.log(community);
    this.setState({ community });
  }

  render() {
    // Make sure we're updating correctly
    //console.log('/* App ---------------------------------------------------*/');
    //console.log(this.state);

    return (
      <div className="App">
        <Grid fluid={true} id="app_ref">
          <TitleRow/>

          <Toolbar
            handleChart={this.handleBtnChart}
            handleView={this.handleBtnView}
          />

          <hr/>

          {/* Dashboard row */}
          <CommunityGrid
            width={this.state.width}
            height={this.state.height / 4}
            community={this.state.community}
            view={this.state.view}
            onClickCloud={this.handleClickCloud}
          />

          <Row style={center_styles}>
            <Cartogrid
              width={this.state.width}
              height={this.state.height}
              padding={this.state.padding}
              chart={this.state.chart}
              view={this.state.view}
              community={this.state.community}
              onClickState={this.handleClickTile}
              selected_state={this.state.statefp}
            />
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
