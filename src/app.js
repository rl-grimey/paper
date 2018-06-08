import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.css';

import Cartogrid from './Cartogrid/Cartogrid';
import ClusterCloud from './Cartogrid/plots/clusterCloud';
import ClusterTile from './Cartogrid/plots/clusterTile';
import { 
  loadData, 
  clickCountTile,
  clickClusterTile,
  clickClusterCloud,
  clickSentTile,
  getStateHeirarchy,
  getStateTimeHeirarchy,
  getStateTimeCluster
} from './utilities';
import { Slider, HelpButton } from './widgets';
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

      kernelSize: 0.075,

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
      clusterTokens:undefined,
      stateSents: undefined
    }

    this.clickCountTile = clickCountTile.bind(this);
    this.clickClusterTile = clickClusterTile.bind(this);
    this.clickSentTile = clickSentTile.bind(this);
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

    const clusterScale = d3.scaleOrdinal()
        .domain([
          1, 3, 4, 6, 
          0, 5, 7, 
          2, 8, 9, undefined])
        .range([
          '#fccde5', '#bebada', '#bc80bd', '#80b1d3',
          '#8dd3c7', '#b3de69', '#ccebc5', 
          '#dddddd', '#dddddd', '#dddddd', '#222222']);


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
    else if (this.state.cartoType === 'sentiment' && this.state.stateSents) {
      data = this.state.stateSents;
      colorScale = d3.scaleThreshold()
        .domain([0, 1])
        .range(['#2166ac33', '#dddddd', '#b2182b33']);
      callback = this.clickSentTile;
    }




    // Make sure we're updating correctly
    //console.log('-----------------------------------------------------');
    //console.log('statefp', this.state.statefp);
    //console.log('topic', this.state.topic);
    //console.log('cluster', this.state.cluster);
    //console.log('period', this.state.period);
    //console.log('Num topics', this.state.num_topics);
    //console.log(this.state);

    return (
      <div className="App">
        <Grid fluid={true}>

          {/* Title Row*/}
          <Row>
            <Col xs={11}>
              <h3>
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
            {/* Before clusters column */}
            {this.state.clusterTokens && 
              <Col xs={2}>
                <ClusterCloud
                  data={this.state.clusterTokens}
                  selectedCluster={this.state.cluster}
                  cluster={'1'}
                  width={this.state.width * 0.175}
                  height={this.state.height * 0.25}
                  colorScale={clusterScale}
                  onClick={() => this.setState(clickClusterCloud(1))}
                  //onWordClick={}
                />
                <ClusterCloud
                  data={this.state.clusterTokens}
                  selectedCluster={this.state.cluster}
                  cluster={'3'}
                  width={this.state.width * 0.175}
                  height={this.state.height * 0.25}
                  colorScale={clusterScale}
                  onClick={() => this.setState(clickClusterCloud(3))}
                  //onWordClick={}
                />
                <ClusterCloud
                  data={this.state.clusterTokens}
                  selectedCluster={this.state.cluster}
                  cluster={'4'}
                  width={this.state.width * 0.175}
                  height={this.state.height * 0.25}
                  colorScale={clusterScale}
                  onClick={() => this.setState(clickClusterCloud(4))}
                  //onWordClick={}
                />
                <ClusterCloud
                  data={this.state.clusterTokens}
                  selectedCluster={this.state.cluster}
                  cluster={'6'}
                  width={this.state.width * 0.175}
                  height={this.state.height * 0.25}
                  colorScale={clusterScale}
                  onClick={() => this.setState(clickClusterCloud(6))}
                  //onWordClick={}
                />
              </Col>
            }
            
            {/* Overview columns */}
            <Col xs={8}>
              <Cartogrid
                width={this.state.width}
                height={this.state.height}
                padding={this.state.padding}
                kernelSize={this.state.kernelSize}
                cartoType={this.state.cartoType}
                statefp={this.state.statefp}
                data={data}
                colorScale={colorScale}
                clickCallback={e => this.setState(callback(e))}
                maxCount={this.state.maxCount}
                cluster={this.state.cluster}
              />
            </Col>
            
            {/* After clusters column */}
            {this.state.clusterTokens && 
              <Col xs={2}>
                <ClusterCloud
                  data={this.state.clusterTokens}
                  selectedCluster={this.state.cluster}
                  cluster={'0'}
                  width={this.state.width * 0.175}
                  height={this.state.height * 0.25}
                  colorScale={clusterScale}
                  onClick={() => this.setState(clickClusterCloud(0))}
                  //onWordClick={}
                />
                <ClusterCloud
                  data={this.state.clusterTokens}
                  selectedCluster={this.state.cluster}
                  cluster={'5'}
                  width={this.state.width * 0.175}
                  height={this.state.height * 0.25}
                  colorScale={clusterScale}
                  onClick={() => this.setState(clickClusterCloud(5))}
                  //onWordClick={}
                />
                <ClusterCloud
                  data={this.state.clusterTokens}
                  selectedCluster={this.state.cluster}
                  cluster={'7'}
                  width={this.state.width * 0.175}
                  height={this.state.height * 0.25}
                  colorScale={clusterScale}
                  onClick={() => this.setState(clickClusterCloud(7))}
                  //onWordClick={}
                />
                <div>
                  <h4>Charts</h4>
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
                  <button 
                    className="btn btn-light"
                    name={'cartoType'} 
                    value={'sentiment'}
                    onClick={this.onChange}
                  >Sentiments</button>
                  {this.state.cartoType === 'cluster' && 
                    <button
                      className="btn btn-dark"
                      name={'cluster'}
                      value={undefined}
                      onClick={() => this.setState({ cluster: undefined })}
                    >Reset Cluster
                    </button>
                  }
                </div>
              </Col>
            }
          </Row>

          <hr/>

          {/* UI Controls */}
          <Row>
            <Col xs={4}>
              <div>
                <h4>Before Table</h4>        
              </div>
              <div>
                <p>Table</p>
              </div>
            </Col>

            <Col xs={4}>
              <div>
                <h4>After Table</h4>        
              </div>
              <div>
                <p>Table</p>
              </div>
            </Col>

            <Col xs={4}>
              <div>
                <h4>Settings</h4>        
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
                <Slider
                  label={'Kernel'}
                  name={'kernelSize'}
                  min={0.001}
                  max={0.25}
                  step={0.01}
                  value={this.state.kernelSize}
                  onChange={this.onChange}
                />                
              </div>
            </Col>
          </Row>
          
        </Grid>
      </div>
    );
  }
}

export default App;
