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
      height : 800,
      padding: 0.00,

      chart    : 'topics',
      view     : 'absolute',
      tile     : 'total_tweets',
      community: null,
      statefp  : null,
      week     : null
    }

    this.handleResize     = this.handleResize.bind(this);
    this.handleEscape     = this.handleEscape.bind(this);
    this.handleBtnChart   = this.handleBtnChart.bind(this);
    this.handleBtnView    = this.handleBtnView.bind(this);
    this.handleBtnTile    = this.handleBtnTile.bind(this);
    this.handleClickTile  = this.handleClickTile.bind(this);
    this.handleClickCloud = this.handleClickCloud.bind(this);
  }

  componentDidMount() {
    /* Adds resize and escape handling */
    this.handleResize();

    /* Clears our selected state/topic if escape is pressed */
    document.addEventListener('keydown', (evt) => {
      switch(evt.keyCode) {
        case 27:
          this.handleEscape();
          break;
        default:
          break;
      }
    });
  }

  handleResize() {
    /* Adjust width to maximum possible after the component mounts. */
    let app_div = document.querySelector('#app_ref');
    let app_width = app_div.clientWidth;

    // Height
    this.setState({ width: app_width });
  }

  handleEscape(event) {
    /* Clears our selected state/topic if escape is pressed */
    this.setState({ statefp: null, community: null, week: null });
  }

  handleBtnChart(chart) {
    /* Sets our chart state based on the currently selected toolbar button. */
    this.setState({ chart });
  }

  handleBtnView(view) {
    /* Changes our data view (either absolute or relative) */
    this.setState({ view });
  }

  handleBtnTile(tile) {
    /* Sets our tile sizing */
    this.setState({ tile });
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
            handleTile={this.handleBtnTile}
          />

          <hr/>

          <div id='figureDiv'>
            {this.state.chart === 'topics' && <CommunityGrid
              width={this.state.width}
              height={this.state.height / 4}
              community={this.state.community}
              view={this.state.view}
              onClickCloud={this.handleClickCloud}
            />}

            <Row style={center_styles}>
              <Cartogrid
                width={this.state.width}
                height={this.state.height}
                padding={this.state.padding}
                chart={this.state.chart}
                view={this.state.view}
                tile={this.state.tile}
                community={this.state.community}
                onClickState={this.handleClickTile}
                selected_state={this.state.statefp}
                escape={this.handleEscape}
              />
            </Row>
          </div>
        </Grid>
      </div>
    );
  }
}

export default App;
