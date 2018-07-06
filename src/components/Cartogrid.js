/* Dependencies */
import React from 'react';
import { scaleBand } from '@vx/scale';
import * as d3 from 'd3';
import { Text } from '@vx/text';

/* Components */
import CartoLegend from './widgets/CartoLegend';
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
    width = width * 0.675;
    let {x_scale, y_scale} = get_scales(width, height, padding);

    this.state = {
      width             : width,
      height            : height,
      padding           : padding,
      x_scale           : x_scale,
      y_scale           : y_scale,
      tile_scale        : undefined,
      data              : {},
      chart             : props.chart,
      view              : props.view,
      tile              : props.tile,
      community         : props.community,
      selected_state    : props.selected_state
    };

    // Functions to create state plots
    this.create_tile  = this.create_tile.bind(this);
    this.create_chart = this.create_chart.bind(this);
    this.create_tile_scale = this.create_tile_scale.bind(this);
  }

  componentWillMount() { 
    // Load data, and set our scales
    let data = require('../data/visualization.json');

    // Compute scales
    let tile_scale = this.create_tile_scale(data, this.state.tile);

    this.setState({ data, tile_scale });
  }

  componentWillReceiveProps(nextProps) {
    // Scale dimensions
    let width   = nextProps.width * 0.675;
    let height  = nextProps.height
    let padding = nextProps.padding

    // Create new scales
    let {x_scale, y_scale} = get_scales(width, height, padding);
    let tile_scale = this.create_tile_scale(this.state.data, nextProps.tile);

    this.setState({ 
      ...nextProps, 
      x_scale, 
      y_scale,
      tile_scale,
      width 
    });
  }

  create_tile_scale(data, tile_attr) {
    /* Creates a scale sizing the tile based on our data view. */
    //let view_attr = (view === 'absolute') ? 'total_tweets' : 'pop17';

    // Map the state's view attr from the info
    let state_attrs = d3.values(data).map(d => d.info[tile_attr]);
    let domain = d3.extent(state_attrs);

    console.log(tile_attr, state_attrs);
    

    // Create two scales
    let absolute_scale = d3.scaleLog()
      .base(2)
      .domain(domain)
      .range([0.5, 1.0]);

    let relative_scale = d3.scaleQuantile()
      .domain(domain)
      .range([0.5, 0.675, 0.85, 1.0]);

    return (tile_attr === 'total_tweets') ? absolute_scale : relative_scale;
  }

  create_tile(state, i) {
    // Size the tile first
    //let view_attr = (this.state.view === 'absolute') ? 'total_tweets' : 'pop17';
    let scale = this.state.tile_scale(state.info[this.state.tile]);
    
    // Shift to center the tiles due to scaling
    let tile_width_offset = (this.state.x_scale.bandwidth() - (scale * this.state.x_scale.bandwidth())) / 2;
    let tile_height_offset = (this.state.y_scale.bandwidth() - (scale * this.state.y_scale.bandwidth())) / 2;

    let top = this.state.y_scale(state.info.y) + tile_height_offset;
    let left = this.state.x_scale(state.info.x) + tile_width_offset;
    
    // Resize the tile dimensions
    let tile_width = this.state.x_scale.bandwidth() * scale;
    let tile_height = this.state.y_scale.bandwidth() * scale;

    // Font styles
    let selected = state.info.abbrv === this.state.selected_state;
    let font_weight = (selected) ? 'bold' : '500';

    return (
      <Gridtile
        key={i}
        abbrv={state.info.abbrv}
        top={top}
        left={left}
        width={tile_width}
        height={tile_height}
        selected_state={this.state.selected_state}
        view={this.state.view}
        onClick={this.props.onClickState}
      >
        {this.create_chart(tile_width, tile_height, state)}
        <Text
          fontSize={11}
          fontWeight={font_weight}
          fontFamily={'sans-serif'}
          textAnchor={'end'}
          style={{'opacity': 0.8}}
          x={tile_width * 0.9}
          y={tile_height * 0.2}
        >{state.info.abbrv}
        </Text>
      </Gridtile>
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
          community={this.state.community}
          info={data.info}
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
    //console.log('-------\nCartogrid --------------------------------------------');
    //console.log(this.state, this.props);

    return (
      <svg 
        className={'cartogrid'}
        width={this.state.width}
        height={this.state.height}
      >
        {this.state.data && 
          d3.values(this.state.data).map((d, i) => this.create_tile(d, i))}
      </svg>
    );
  } 
};