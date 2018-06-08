import React from 'react';
import { scaleBand } from '@vx/scale';
import * as d3 from 'd3';
import { Text } from '@vx/text';

import Gridtile from './Gridtile';
import ClusterTile from './plots/clusterTile';
import CountTile from './plots/countPlot';
import SentimentTile from './plots/sentimentTile';
import states from '../states';


export default class Cartogrid extends React.Component {
  constructor(props) {
    super();

    // Optional params and their defaults
    const width   = props.width;
    const height  = props.height;
    const padding = props.padding;

    this.state = {
      margin: {top: 10, right: 10, bottom: 20, left: 20},
      width:    width,
      height:   height,
      padding:  padding,
      x_scale:  scaleBand({
        domain: [...Array(12).keys()],
        range:  [0, width],
        padding: padding
      }),
      y_scale: scaleBand({
        domain: [...Array(8).keys()],
        range: [0, height],
        padding: padding
      }),
      states: states,
      data: []
    };

    this.create_tile = this.create_tile.bind(this);
    this.createCountTile = this.createCountTile.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Create new scales
    const new_x = new scaleBand({
      domain: [...Array(12).keys()],
      range:  [0, nextProps.width],
      padding: nextProps.padding
    });
    const new_y = new scaleBand({
      domain: [...Array(8).keys()],
      range: [0, nextProps.height],
      padding: nextProps.padding
    });

    return {
      ...prevState,
      ...nextProps,
      x_scale:  new_x,
      y_scale: new_y
    };
  }

  create_tile(st, i) {
    let top = this.state.y_scale(st.y);
    let left = this.state.x_scale(st.x);
    let tile_width = this.state.x_scale.bandwidth();
    let tile_height = this.state.y_scale.bandwidth();

    return (
      <Gridtile
        key={i}
        abbrv={st.abbrv}
        top={top}
        left={left}
        width={tile_width}
        height={tile_height} 
      />
    );
  }

  create_label = (statefp) => {
    const abbrv = this.state.states[statefp].abbrv;

    return (
      <Text
        fontSize={10}
        fontWeight={'bold'}
        fontFamily={'sans-serif'}
        textAnchor={'end'}
        style={{"opacity": 0.75}}
        x={this.state.x_scale.bandwidth() * 0.9}
        y={this.state.y_scale.bandwidth() * 0.2}
      >{abbrv}
      </Text>
    );
  }

  createClusterTile = (d, i) => {
    return (
      <ClusterTile
        statefp={d.statefp}
        before={d.before}
        after={d.after}
        cluster={this.state.cluster}
        width={this.state.x_scale.bandwidth()}
        height={this.state.y_scale.bandwidth()}
        colorScale={this.props.colorScale}
        clickCallback={this.props.clickCallback}
      />
    );
  }

  createCountTile = (d, i) => {
    // Normalize the values by state population
    let state_data = this.state.states[d.key];
    d.values.forEach(v => v.count = v.count / state_data.pop17);
    
    return (
      <CountTile
        data={d.values}
        abbrv={state_data.abbrv}
        maxCount={this.props.maxCount}
        width={this.state.x_scale.bandwidth()}
        height={this.state.y_scale.bandwidth()}
        colorScale={this.props.colorScale}
        clickCallback={this.props.clickCallback}
      />
    );
  }

  createSentimentTile = (d, i) => {
    let vals = d.value;
    
    // State abbrv, so we can filter axes later
    let abbrv = this.state.states[d.key].abbrv;

    // Data
    let beforePos = vals.before.positive;
    let beforeNeg = vals.before.negative;
    let afterPos = vals.after.positive;
    let afterNeg = vals.after.negative;

    return (
      <SentimentTile
        width={this.state.x_scale.bandwidth()}
        height={this.state.y_scale.bandwidth()}
        kernelSize={this.props.kernelSize}
        colorScale={this.props.colorScale}
        clickCallback={this.props.clickCallback}
        abbrv={abbrv}
        statefp={d.key}
        beforePos={beforePos}
        beforeNeg={beforeNeg}
        afterPos={afterPos}
        afterNeg={afterNeg}
      />
    );
  }


  render() {
    // Create new scales each render
    const x_scale = this.state.x_scale;
    const y_scale = this.state.y_scale;

    // Grab current view's data
    const data = this.props.data;
    const cartoType = this.props.cartoType;

    //console.log('-------\nCartogrid --------------------------------------------');
    //console.log(this.state, this.props);

    return (
      <svg 
        className={'cartogrid'}
        width={this.state.width}
        height={this.state.height}
      >
        {cartoType === 'cluster' && this.state.data && this.state.data.map((d, i) => 
          <Gridtile
            key={i}
            abbrv={this.state.states[d.statefp].abbrv}
            selected={this.props.statefp === d.statefp}
            top={y_scale(this.state.states[d.statefp].y)}
            left={x_scale(this.state.states[d.statefp].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
            cartoType={cartoType}
          >
            {this.createClusterTile(d, i)}
            {this.create_label(d.statefp)}
          </Gridtile>
        )}
        {cartoType === 'count' && this.state.data && this.state.data.map((d, i) => 
          <Gridtile
            key={i}
            abbrv={this.state.states[d.key].abbrv}
            selected={this.props.statefp === d.key}
            top={y_scale(this.state.states[d.key].y)}
            left={x_scale(this.state.states[d.key].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
            cartoType={cartoType}
          >
            {this.createCountTile(d, i)}
            {this.create_label(d.key)}
          </Gridtile>
        )}
        {cartoType === 'sentiment' && this.state.data && d3.entries(this.state.data).map((d, i) => 
          <Gridtile
            key={i}
            abbrv={this.state.states[d.key].abbrv}
            selected={this.props.statefp === d.key}
            top={y_scale(this.state.states[d.key].y)}
            left={x_scale(this.state.states[d.key].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
            cartoType={cartoType}
          >
            {this.createSentimentTile(d, i)}
            {this.create_label(d.key)}
          </Gridtile>
        )}
        
      </svg>
    );
  } 
};