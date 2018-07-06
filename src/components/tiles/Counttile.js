/**
 * Bar chart of weekly state tweet counts.
 */

import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear, scaleThreshold } from '@vx/scale';
import { max } from 'd3';
import { weeks } from '../../utilities';


export default class CountTile extends React.Component {
  constructor(props) {
    super();

    // Set up dimensions and scales
    let { width, height, view, data } = props;
    //let { x_scale, y_scale } = get_scales(width, height, props.data);
    let { x_scale, y_scale } = this.create_chart_scales(width, height, view, data);
    let color = scaleThreshold({
      domain: [0],
      range : ['#2166ac', '#b2182b']
    })
    
    this.state = {
      width  : width,
      height : height,
      x_scale: x_scale,
      y_scale: y_scale,
      weeks  : weeks,
      color  : color,
      data   : data,
      view   : view
    }

    this.create_chart_scales = this.create_chart_scales.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { width, height, view } = nextProps;
    let { x_scale, y_scale } = this.create_chart_scales(width, height, view, this.state.data);
    this.setState({ width, height, view, x_scale, y_scale });
  }

  create_chart_scales(width, height, view, data) {
    /* Creates our chart scales, depending on the view passed down to us. */

    // Create padding based on chart size
    let padding = (width > 200) ? 0.4 : 0.075;
    let x_scale = scaleBand({
      domain    : weeks,
      rangeRound: [1, width-1],
      padding   : padding
      // TickFormatting
    })
    
    // Y scale formatting
    let view_attr = (view === 'absolute') ? 'count' : 'rate';
    let y_max = max(data, d => d[view_attr]);

    let y_scale = scaleLinear({
      domain: [0, y_max],
      range : [height-1, 1],
      nice  : true
    })
  
    return { x_scale, y_scale };
  }

  render() {
    // Change data attribute depending on selected view
    let view_attr = (this.state.view === 'absolute') ? 'count' : 'rate';

    return (
      <Group>
        {this.state.data.map((d, i) => {
          return(<Bar
            key={i}
            fill={this.state.color(d.week)}
            stroke={null}
            x={this.state.x_scale(d.week)}
            y={this.state.y_scale(d[view_attr])}
            width={this.state.x_scale.bandwidth()}
            height={this.state.height - this.state.y_scale(d[view_attr])}
          />);
        })}
      </Group>
    );
  }
}