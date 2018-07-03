/* Dependencies */
import React from 'react';
import { scaleBand } from '@vx/scale';
import * as d3 from 'd3';
import { Text } from '@vx/text';

/* Components */
import Gridtile from './Gridtile';

/* Util */
const get_scales = (width, height, padding) => {
  /* Sets scales for us. */
  let x_scale = scaleBand({
    domain : [...Array(12).keys()],
    range  : [0, width],
    padding: padding
  });

  let y_scale = scaleBand({
    domain : [...Array(8).keys()],
    range  : [0, height],
    padding: padding
  });

  return { x_scale, y_scale };
}

export default class Cartogrid extends React.Component {
  constructor(props) {
    super();

    // Create the chart scales
    let width   = props.width;
    let height  = props.height;
    let padding = props.padding;
    let {x_scale, y_scale} = get_scales(width, height, padding);

    this.state = {
      width: width,
      height: height,
      padding: padding,
      x_scale: x_scale,
      y_scale: y_scale,
      data: {}
    };
  }

  componentWillMount() {
    this.setState({ data: require('../visualization.json') });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Create new scales
    let width   = nextProps.width
    let height  = nextProps.height
    let padding = nextProps.padding
    let {x_scale, y_scale} = get_scales(width, height, padding);

    return {
      ...prevState,
      ...nextProps,
      x_scale,
      y_scale
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
    // How are we looking?
    console.log('-------\nCartogrid --------------------------------------------');
    console.log(this.state, this.props);

    // Create new scales each render
    const x_scale = this.state.x_scale;
    const y_scale = this.state.y_scale;

    
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