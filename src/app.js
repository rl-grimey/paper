/* Dependencies */
import React from 'react';
import { Grid, Row } from 'react-bootstrap';

/* Styles */
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';
import { center_styles } from './utilities';

/* Components */
import Toolbar from './components/widgets/Toolbar';
import CommunityGrid from './components/Communitygrid';
import Cartogrid from './components/Cartogrid';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      width  : 1000,
      height : 600,
      padding: 0.01,

      chart    : 'topics',
      view     : 'absolute',
      community: null,
      statefp  : null,
      week     : null
    }

    this.handleResize     = this.handleResize.bind(this);
    this.handleEscape     = this.handleEscape.bind(this);
    this.handleBtnChart   = this.handleBtnChart.bind(this);
    this.handleBtnView    = this.handleBtnView.bind(this);
    this.handleClickTile  = this.handleClickTile.bind(this);
    this.handleClickCloud = this.handleClickCloud.bind(this);
  }

  componentDidMount() {
    /* Adds resize and escape handling */
    this.handleResize();

    document.addEventListener('keydown', this.handleEscape);
  }

  handleResize() {
    /* Adjust width to maximum possible after the component mounts. */
    let app_div = document.querySelector('#app_ref');
    let app_width = app_div.clientWidth;
    this.setState({ width: app_width });
  }

  handleEscape(event) {
    /* Clears our selected state/topic if escape is pressed */
    switch(event.keyCode) {
      case 27:
        this.setState({ statefp: null, community: null, week: null });
        break;
      default:
        break;
    };
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
    this.setState({ community });
  }

  render() {
    // Make sure we're updating correctly
    //console.log('/* App ---------------------------------------------------*/');
    //console.log(this.state);

    return (
      <div className="App">
        <Grid fluid={true} id="app_ref">

          <Toolbar
            handleChart={this.handleBtnChart}
            handleView={this.handleBtnView}
          />

          <hr/>

          {/* Dashboard row */}
          <CommunityGrid
            width={this.state.width}
            height={this.state.height / 3}
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
