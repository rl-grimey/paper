import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.css';

import Cartogrid from './Cartogrid/Cartogrid';
import ClusterCloud from './dod/clusterCloud';
import ClusterTile from './Cartogrid/plots/clusterTile';
import { 
  loadData, 
  clickTreeTile, 
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
      num_topics: 5,
      topic:      0,
      cluster:    0,
      statefp:    '11',
      period:     null,

      // Data
      counts:       undefined,
      maxCount:     undefined,
      topicVectors: undefined,
      topicTimeVectors: undefined,
      topicTokens:  undefined,
      clusterTokens:undefined,
      counties:     undefined,
      tweets:       undefined
    }

    this.clickTreeTile = clickTreeTile.bind(this);
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

    if (this.state.cartoType === 'tree' && this.state.topicVectors) {
      data = this.state.topicVectors.values()
        .map(stateVec => getStateHeirarchy(stateVec, this.state.num_topics));

      // Get unique topics across all states
      let topics = [].concat.apply([], data.map(d => d.children))
        .filter(d => typeof(d.name) == 'number')
        .map(d => d.name)
        .filter((x, i, a) => a.indexOf(x) === i);
      
      // Map them to an ordinal color scale
      colorScale = d3.scaleOrdinal()
        .domain(topics)
        .range(d3.schemeCategory20c);

      // Assign callback
      callback = this.clickTreeTile;
    }
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
    else if (this.state.cartoType === 'dot' && this.state.topicTimeVectors) {
      // Create an array of objects with each state's FIPS and top n topics by time
      // e.g. [... {
      //  statefp: 01, 
      //  before: [{name: 1, prob: 1.00}, ...]}, 
      //  after: [{name: 1, prob: 1.00}], ...]
      // }, ...]
      data = d3.entries(this.state.topicTimeVectors)
        .map(state => {
          let fips = state.key;
          let top_topics_time = getStateTimeHeirarchy(state.value, this.state.num_topics);
          top_topics_time['statefp'] = fips;
          return top_topics_time;
        });
      
      // Get the distinct topics from each vector
      // Before and after
      let topics_before = [].concat.apply([], data.map(d => d.before)).map(d => d.topic);
      let topics_after = [].concat.apply([], data.map(d => d.after)).map(d => d.topic);
      // Combine them and get unique
      let topics = topics_before.concat(topics_after).filter((x, i, a) => a.indexOf(x) === i);
      // Get their counts
      let topic_cnts = d3.nest().key(d => d).rollup(v => v.length).entries(topics);

      // Map them to an ordinal color scale
      colorScale = d3.scaleOrdinal()
        .domain(topics)
        .range(d3.schemeCategory20c);

      //console.log(data, topics_before, topics_after, topics, topic_cnts);
    }
    else if (this.state.cartoType === 'bar' && this.state.topicTimeVectors) {
      // Create an array of objects with each state's FIPS and top n topics by time
      // e.g. [... {
      //  statefp: 01, 
      //  before: [{name: 1, prob: 1.00}, ...]}, 
      //  after: [{name: 1, prob: 1.00}], ...]
      // }, ...]
      data = d3.entries(this.state.topicVectorsLong);

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
    //console.log(this.state);

    return (
      <div className="App">
        <Grid>
          <Col>

          {/* Title */}
          <Row>
            <Col xs={12}>
              <h3>CarTopic Visualization of Immigrant-related Tweets <i>before</i> and <i>after</i> the Travel Ban.</h3>
            </Col>
          </Row>

          <hr/>

          {/* Top clusters*/}
          {this.state.clusterTokens && 
            <Row>
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
                cluster={'2'}
                width={this.state.width * 0.2}
                height={this.state.height * 0.3}
                colorScale={clusterScale}
                onClick={() => this.setState(clickClusterCloud(2))}
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
            </Row>}

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
          
          {/* Details on demand */}
          {this.state.clusterTokens && 
            <Row>
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
                cluster={'6'}
                width={this.state.width * 0.2}
                height={this.state.height * 0.3}
                colorScale={clusterScale}
                onClick={() => this.setState(clickClusterCloud(6))}
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
              <ClusterCloud
                data={this.state.clusterTokens}
                selectedCluster={this.state.cluster}
                cluster={'8'}
                width={this.state.width * 0.2}
                height={this.state.height * 0.3}
                colorScale={clusterScale}
                onClick={() => this.setState(clickClusterCloud(8))}
                //onWordClick={}
              />
              <ClusterCloud
                data={this.state.clusterTokens}
                selectedCluster={this.state.cluster}
                cluster={'9'}
                width={this.state.width * 0.2}
                height={this.state.height * 0.3}
                colorScale={clusterScale}
                onClick={() => this.setState(clickClusterCloud(9))}
                //onWordClick={}
              />
            </Row>}

            <hr/>

            {/* UI Controls */}
            <Row>
              <Col xs={6}>
                <div>
                  <h5>Charts</h5>        
                </div>
                <div>
                  {/*<button 
                    name={'cartoType'} 
                    value={'tree'}
                    onClick={this.onChange}
                    selected
                  >TreeMap</button>*/}
                  <button 
                    name={'cartoType'} 
                    value={'cluster'}
                    onClick={this.onChange}
                  >Clusters</button>
                  <button 
                    name={'cartoType'} 
                    value={'count'}
                    onClick={this.onChange}
                  >Counts</button>
                  {/*<button 
                    name={'cartoType'} 
                    value={'dot'}
                    onClick={this.onChange}
                  >Dots</button>
                  <button 
                    name={'cartoType'} 
                    value={'bar'}
                    onClick={this.onChange}
                  >Bars</button>*/}
                </div>
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
                  {/*<Slider
                    label={'Number of Topics'}
                    name={'num_topics'}
                    min={3}
                    max={10}
                    step={1}
                    value={this.state.num_topics}
                    onChange={this.onChange}
                  />*/}
                </div>
              </Col>
            </Row>

            {/*<TopicCloud
                data={this.state.topicTokens}
                topic={this.state.topic}
                width={this.state.width * 0.2}
                height={this.state.height * 0.2}
                //onWordClick={}
              />
              <Col xsOffset={2}>
                <TopicDetails
                  width={this.state.width * 0.33}
                  height={this.state.height * 0.66}
                  margin={margin}
                  topic={this.state.topic}
                  data={this.state.topicTokens}
                />
              </Col>
              <Col>
                <TopicDetails
                  width={this.state.width * 0.33}
                  height={this.state.height * 0.66}
                  margin={margin}
                />
              </Col>
              <Col>
                <SpatialDetails
                  data={this.state.counties}
                  statefp={this.state.statefp}
                  width={this.state.width * 0.33}
                  height={this.state.height * 0.66}
                />
            </Col>*/}  

          </Col>             
        </Grid>
      </div>
    );
  }
}

export default App;
