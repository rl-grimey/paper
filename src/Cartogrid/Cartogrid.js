import React from 'react';
import { scaleBand } from '@vx/scale';

import * as d3 from 'd3';
import Gridtile from './Gridtile';
import TreeTile from './plots/treeTile';
import ClusterTile from './plots/clusterTile';
import CountTile from './plots/countPlot';
import DotTile from './plots/dotTile';
import BarTile from './plots/barTile';
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
    this.createTreeTile = this.createTreeTile.bind(this);
    this.createCountTile = this.createCountTile.bind(this);
    this.createDotTile = this.createDotTile.bind(this);
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

  createTreeTile = (d, i) => {
    return (
      <TreeTile 
        data={d}
        top={0}
        left={0}
        size={[
          this.state.x_scale.bandwidth(), 
          this.state.y_scale.bandwidth()
        ]}
        colorScale={this.props.colorScale}
        clickCallback={this.props.clickCallback}
      />
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
        maxCount={this.props.maxCount}
        width={this.state.x_scale.bandwidth()}
        height={this.state.y_scale.bandwidth()}
        colorScale={this.props.colorScale}
        clickCallback={this.props.clickCallback}
      />
    );
  }

  createDotTile = (d, i) => {
    return (
      <DotTile
        statefp={d.statefp}
        before={d.before}
        after={d.after}
        width={this.state.x_scale.bandwidth()}
        height={this.state.y_scale.bandwidth()}
        colorScale={this.props.colorScale}
      />
    );
  }

  createBarTile = (d, i) => {
    return (
      <BarTile
        data={d3.values(d.value)}
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
        {cartoType === 'tree' && this.state.data && this.state.data.map((d, i) => 
          <Gridtile
            key={i}
            abbrv={d.data.name}
            top={y_scale(this.state.states[d.data.statefp].y)}
            left={x_scale(this.state.states[d.data.statefp].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
          >
            {this.createTreeTile(d, i)}
          </Gridtile>
        )}
        {cartoType === 'cluster' && this.state.data && this.state.data.map((d, i) => 
          <Gridtile
            key={i}
            abbrv={this.state.states[d.statefp].abbrv}
            top={y_scale(this.state.states[d.statefp].y)}
            left={x_scale(this.state.states[d.statefp].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
          >{this.createClusterTile(d, i)}
          </Gridtile>
        )}
        {cartoType === 'count' && this.state.data && this.state.data.map((d, i) => 
          <Gridtile
            key={i}
            abbrv={this.state.states[d.key].abbrv}
            top={y_scale(this.state.states[d.key].y)}
            left={x_scale(this.state.states[d.key].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
          >
            {this.createCountTile(d, i)}
          </Gridtile>
        )}
        {cartoType === 'dot' && this.state.data && this.state.data.map((d, i) => 
          <Gridtile
            key={i}
            abbrv={this.state.states[d.statefp].abbrv}
            top={y_scale(this.state.states[d.statefp].y)}
            left={x_scale(this.state.states[d.statefp].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
          >
            {this.createDotTile(d, i)}
          </Gridtile>
        )}
        {cartoType === 'bar' && this.state.data && this.state.data.map((d, i) => 
          <Gridtile
            key={i}
            abbrv={this.state.states[d.key].abbrv}
            top={y_scale(this.state.states[d.key].y)}
            left={x_scale(this.state.states[d.key].x)}
            width={x_scale.bandwidth()}
            height={y_scale.bandwidth()}
          >
            {this.createBarTile(d, i)}
          </Gridtile>
        )}
      </svg>
    );
  } 
};

/* Map using states with no data
states.map((d, i) => 
    <Gridtile
      key={i}
      abbrv={d.abbrv}
      top={y_scale(d.y)}
      left={x_scale(d.x)}
      width={x_scale.bandwidth()}
      height={y_scale.bandwidth()}
      //data={data[d.statefp]}
    />
)
const tiles = states.map((d, i) => this.create_tile(d, i));
*/