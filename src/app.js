import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.css';

import Cartogrid from './Cartogrid/Cartogrid';
import ClusterCloud from './dod/clusterCloud';
import ClusterTile from './Cartogrid/plots/clusterTile';
import { 
  loadData, 
  clickCountTile,
  clickClusterTile,
  clickClusterCloud,
  getStateHeirarchy,
  getStateTimeHeirarchy,
  getStateTimeCluster
} from './utilities';
import { Slider } from './widgets';
import './style.css';


const margin = {
  top: 20,
  right: 20,
  bottom: 25,
  left: 25
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      // Charts
      width: 1000,
      height: 600,
      padding: 0.2,

      // Inputs
      cartoType:  'cluster',
      cluster:    undefined,
      statefp:    '11',
      period:     null,

      // Data
      counts:       undefined,
      maxCount:     undefined,
      topicVectors: undefined,
      topicTimeVectors: undefined,
      clusterTokens:undefined
    }

    this.clickCountTile = clickCountTile.bind(this);
    this.clickClusterTile = clickClusterTile.bind(this);
    this.clickClusterCloud = clickClusterCloud.bind(this);
  }

  componentWillMount() {
    console.log('loading!');
    loadData(data => this.setState(data));
  }

  onChange = (e) => {
    let name = e.target.name;
    let value = (name === 'cartoType') ? e.target.value : +e.target.value;
    this.setState({ [name]: value});
  }

  render() {
    let data = [],
        colorScale = [],
        callback = null;

    const org_colors = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3',
        '#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd', '#333333'];
    const clusterScale = d3.scaleOrdinal()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, undefined])
      .range(['#80b1d3', '#fdb462', '#dddddd', '#fb8072', '#ffffb3',
        '#bc80bd', '#fccde5', '#bebada', '#d9d9d9', '#1f78b4', '#222222']);


    /* Data manipulation for each chart type */
    if (this.state.cartoType === 'cluster' && this.state.topicTimeVectors) {
      // Get state cluster for before and after
      data = d3.entries(this.state.topicTimeVectors)
        .map(state => {
          let fips = state.key;
          let top_topics_time = getStateTimeCluster(state.value);
          top_topics_time['statefp'] = fips;
          return top_topics_time;
        });

      // Color scale, we only have 8 clusters
      colorScale = clusterScale;

      // Assign the cluster callback 
      callback = this.clickClusterTile;
    }
    else if (this.state.cartoType === 'count' && this.state.counts) {
      data = this.state.counts;
      colorScale = d3.scaleThreshold()
        .domain([0, 1])
        .range(['#2166ac', '#dddddd', '#b2182b']);
      callback = this.clickCountTile;
    }

    // Make sure we're updating correctly
    console.log('-----------------------------------------------------');
    console.log('statefp', this.state.statefp);
    console.log('topic', this.state.topic);
    console.log('cluster', this.state.cluster);
    console.log('period', this.state.period);
    console.log('Num topics', this.state.num_topics);
    console.log(this.state);

    return (
      <div className="App">
        <Grid fluid={true}>
          <Col>

          {/* Title */}
          <Row>
            <Col xs={12}>
              <h3>
                <abbr 
                  title="Cartographic Topic Visualization of Immigrant-related Tweets *before* and *after* the Travel Ban."
                >CarTopicVis
                </abbr>
              </h3>
            </Col>
          </Row>

          <hr/>

          {/* Wordclouds! */}
          <Row>
            {/* Before */}
            <Col>
              {this.state.clusterTokens && 
                <Row className={"clouds-before"}>
                  <ClusterCloud
                    data={this.state.clusterTokens}
                    selectedCluster={this.state.cluster}
                    cluster={'1'}
                    width={this.state.width * 0.2}
                    height={this.state.height * 0.3}
                    colorScale={clusterScale}
                    onClick={() => this.setState(clickClusterCloud(1))}
                    //onWordClick={}
                  />

                  <ClusterCloud
                    data={this.state.clusterTokens}
                    selectedCluster={this.state.cluster}
                    cluster={'3'}
                    width={this.state.width * 0.2}
                    height={this.state.height * 0.3}
                    colorScale={clusterScale}
                    onClick={() => this.setState(clickClusterCloud(3))}
                    //onWordClick={}
                  />
                  <ClusterCloud
                    data={this.state.clusterTokens}
                    selectedCluster={this.state.cluster}
                    cluster={'4'}
                    width={this.state.width * 0.2}
                    height={this.state.height * 0.3}
                    colorScale={clusterScale}
                    onClick={() => this.setState(clickClusterCloud(4))}
                    //onWordClick={}
                  />
                  <ClusterCloud
                    data={this.state.clusterTokens}
                    selectedCluster={this.state.cluster}
                    cluster={'6'}
                    width={this.state.width * 0.2}
                    height={this.state.height * 0.3}
                    colorScale={clusterScale}
                    onClick={() => this.setState(clickClusterCloud(6))}
                    //onWordClick={}
                  />
                </Row>
              }
            </Col>
            {/* After */}
            <Col>
              {this.state.clusterTokens && 
                <Row className={"clouds-after"}>
                  <ClusterCloud
                    data={this.state.clusterTokens}
                    selectedCluster={this.state.cluster}
                    cluster={'0'}
                    width={this.state.width * 0.2}
                    height={this.state.height * 0.3}
                    colorScale={clusterScale}
                    onClick={() => this.setState(clickClusterCloud(0))}
                    //onWordClick={}
                  />

                  <ClusterCloud
                    data={this.state.clusterTokens}
                    selectedCluster={this.state.cluster}
                    cluster={'5'}
                    width={this.state.width * 0.2}
                    height={this.state.height * 0.3}
                    colorScale={clusterScale}
                    onClick={() => this.setState(clickClusterCloud(5))}
                    //onWordClick={}
                  />
                  <ClusterCloud
                    data={this.state.clusterTokens}
                    selectedCluster={this.state.cluster}
                    cluster={'7'}
                    width={this.state.width * 0.2}
                    height={this.state.height * 0.3}
                    colorScale={clusterScale}
                    onClick={() => this.setState(clickClusterCloud(7))}
                    //onWordClick={}
                  />
                </Row>
              }
            </Col>
          </Row>

          <hr/>

          {/* Before clusters*/}


          {/* Overview */}
          <Row>
            <Cartogrid
              width={this.state.width}
              height={this.state.height}
              padding={this.state.padding}
              cartoType={this.state.cartoType}
              data={data}
              colorScale={colorScale}
              clickCallback={e => this.setState(callback(e))}
              maxCount={this.state.maxCount}
              cluster={this.state.cluster}
            />
          </Row>
          
          {/* After clusters */}
          

            <hr/>

            {/* UI Controls */}
            <Row>
              <Col xs={6}>
                <div>
                  <h5>Charts</h5>        
                </div>
                <div>
                  <button 
                    className="btn btn-light"
                    name={'cartoType'} 
                    value={'cluster'}
                    onClick={this.onChange}
                  >Clusters</button>
                  <button 
                    className="btn btn-light"
                    name={'cartoType'} 
                    value={'count'}
                    onClick={this.onChange}
                  >Counts</button>
                </div>
                {this.state.cartoType === 'cluster' && 
                  <button
                    className="btn btn-dark"
                    name={'cluster'}
                    value={undefined}
                    onClick={() => this.setState({ cluster: undefined })}
                  >Reset Cluster
                  </button>
                }
              </Col>

              <Col 
                className={'pull-right'}
                xs={3}
                xsPush={9}
              >
                <div>
                  <h5>Settings</h5>        
                </div>
                <div>
                  <Slider
                    label={'Tile Padding'}
                    name={'padding'}
                    min={0}
                    max={1}
                    step={0.1}
                    value={this.state.value}
                    onChange={this.onChange}
                  />
                  <Slider
                    label={'Width'}
                    name={'width'}
                    min={960}
                    max={1200}
                    step={5}
                    value={this.state.width}
                    onChange={this.onChange}
                  />
                  <Slider
                    label={'Height'}
                    name={'height'}
                    min={500}
                    max={750}
                    step={5}
                    value={this.state.height}
                    onChange={this.onChange}
                  />
                </div>
              </Col>
            </Row>

          </Col>             
        </Grid>
      </div>
    );
  }
}

export default App;
