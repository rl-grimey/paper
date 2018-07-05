/* Dependencies */
import React from 'react';
import { scaleBand } from '@vx/scale';
import * as d3 from 'd3';
import { Text } from '@vx/text';

/* Components */
import Gridtile from './tiles/Gridtile';
import CommunityTile from './tiles/CommunityTile';
import CountTile from './tiles/Counttile';
import SentTile from './tiles/Senttile';

/* Util */
const get_scales = (width, height, padding) => {
  /* Sets scales for us. */
  let x_scale = scaleBand({
    domain : [...Array(11).keys()],
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
    let { width, height, padding } = props;
    width = width * 0.9;
    let {x_scale, y_scale} = get_scales(width, height, padding);

    this.state = {
      width  : width,
      height : height,
      padding: padding,
      x_scale: x_scale,
      y_scale: y_scale,
      data   : {},
      chart  : props.chart,
      view   : props.view
    };

    // Functions to create state plots
    this.create_tile  = this.create_tile.bind(this);
    this.create_label = this.create_label.bind(this);
    this.create_chart = this.create_chart.bind(this);
  }

  componentWillMount() { 
    this.setState({ data: require('../data/visualization.json') });
  }

  componentWillReceiveProps(nextProps) {
    // Create new scales
    let width   = nextProps.width * 0.9;
    let height  = nextProps.height
    let padding = nextProps.padding
    let {x_scale, y_scale} = get_scales(width, height, padding);

    this.setState({ 
      ...nextProps, 
      x_scale, 
      y_scale,
      width 
    });
  }

  create_tile(state, i) {
    let top = this.state.y_scale(state.info.y);
    let left = this.state.x_scale(state.info.x);
    let tile_width = this.state.x_scale.bandwidth();
    let tile_height = this.state.y_scale.bandwidth();

    return (
      <Gridtile
        key={i}
        abbrv={state.info.abbrv}
        top={top}
        left={left}
        width={tile_width}
        height={tile_height} 
      >
        {this.create_chart(tile_width, tile_height, state)}
        {this.create_label(state.info.abbrv)}
      </Gridtile>
    );
  }

  create_label = (abbrv) => {
    return (
      <Text
        fontSize={11}
        fontWeight={'500'}
        fontFamily={'sans-serif'}
        textAnchor={'end'}
        style={{'opacity': 0.75}}
        x={this.state.x_scale.bandwidth() * 0.9}
        y={this.state.y_scale.bandwidth() * 0.2}
      >{abbrv}
      </Text>
    );
  }

  create_chart = (width, height, data) => {
    /* Creates a chart on our state tile, depends on current chart selected. */
    let weekly_max = d3.max(data.counts, d => d.count);

    switch(this.state.chart) {
      case 'topics':
        return(<CommunityTile
          width={width}
          height={height}
          data={data.communities}
          weekly_max={weekly_max}
          view={this.state.view}
          />);
      case 'counts':
        return(<CountTile
          width={width}
          height={height}
          data={data.counts}
          weekly_max={weekly_max}
          view={this.state.view}
        />);
      case 'sents':
        return (<SentTile
          width={width}
          height={height}
          data={data.sentiments}
          view={this.state.view}
        />);
      default:
          return null;
    }
  }

  render() {
    // How are we looking?
    console.log('-------\nCartogrid --------------------------------------------');
    console.log(this.state, this.props);

    return (
      <svg 
        className={'cartogrid'}
        width={this.state.width}
        height={this.state.height}
      >
        {this.state.data && 
          d3.values(this.state.data).map((d, i) => this.create_tile(d, i))
        }
      </svg>
    );
  } 
};