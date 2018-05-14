import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import * as d3 from 'd3';
import 'bootstrap/dist/css/bootstrap.css';

import Cartogrid from './Cartogrid/Cartogrid';
import TopicDetails from './dod/topicDetails';
import SpatialDetails from './dod/spatialDetail';
import { loadData, clickTreeTile, clickCountTile } from './utilities';
import { Slider } from './widgets';


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
      width: 960,
      height: 500,
      padding: 0.1,

      // Inputs
      cartoType: 'tree',
      topic: null,
      statefp: null,
      period: null,

      // Data
      counts: [],
      topicVectors: {},
      counties: []
    }

    this.clickTreeTile = clickTreeTile.bind(this);
    this.clickCountTile = clickCountTile.bind(this);
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
        callback;

    if (this.state.cartoType === 'tree' && this.state.topTopicVectors !== undefined) {
      data = this.state.topTopicVectors;

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
    else if (this.state.cartoType === 'count' && this.state.counts.length > 0) {
      data = this.state.counts;
      colorScale = d3.scaleThreshold()
        .domain([0, 1])
        .range(['#2166ac', '#dddddd', '#b2182b']);
      callback = this.clickCountTile;
    }

    // Make sure we're updating correctly
    console.log('statefp', this.state.statefp);
    console.log('topic', this.state.topic);
    console.log('period', this.state.period);

    return (
      <div className="App">
        <Grid>

          <Row>
            <Col xs={12}>
              <h3>CartoGrid</h3>
            </Col>
          </Row>

          <Row>
            <Col xs={2}>
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
              <div>
                <button 
                  name={'cartoType'} 
                  value={'tree'}
                  onClick={this.onChange}
                  selected
                >TreeMap</button>
                <button 
                  name={'cartoType'} 
                  value={'count'}
                  onClick={this.onChange}
                >Counts</button>
              </div>
            </Col>

            <Col xs={10}>
              <Cartogrid
                width={this.state.width}
                height={this.state.height}
                padding={this.state.padding}
                cartoType={this.state.cartoType}
                data={data}
                colorScale={colorScale}
                clickCallback={e => this.setState(callback(e))}
              />
            </Col>

          </Row>
          <Row>
            <Col>
              <TopicDetails
                width={this.state.width * 0.33}
                height={this.state.height * 0.66}
                margin={margin}
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
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
