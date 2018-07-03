/* Dependencies */
import React from 'react';
import { scaleBand } from '@vx/scale';
import * as d3 from 'd3';
import { Text } from '@vx/text';

/* Components */
import Gridtile from './Gridtile';

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
      data: []
    };
  }

  componentWillMount() {
    console.log('loading!');
    this.setState({ 
      data: require('../visualization.json') 
    });
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

  render() {
    // Create new scales each render
    const x_scale = this.state.x_scale;
    const y_scale = this.state.y_scale;

    // Grab current view's data
    const data = this.props.data;
    const cartoType = this.props.cartoType;

    console.log('-------\nCartogrid --------------------------------------------');
    console.log(this.state, this.props);

    return (
      <svg 
        className={'cartogrid'}
        width={this.state.width}
        height={this.state.height}
      >
      </svg>
    );
  } 
};