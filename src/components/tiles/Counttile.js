/**
 * Bar chart of weekly state tweet counts.
 */

import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear, scaleThreshold } from '@vx/scale';
import { max } from 'd3';

/* Scale utility */
const weeks = [-4, -3, -2, -1, 1, 2, 3, 4];
const get_scales = (width, height, data) => {
  let x_scale = scaleBand({
    domain    : weeks,
    rangeRound: [1, width-1],
    padding   : 0.05
    // TickFormatting
  })

  let y_max = max(data, d => d.count);

  let y_scale = scaleLinear({
    domain: [0, y_max],
    range : [height-1, 1],
    nice  : true
  })

  return { x_scale, y_scale };
}

export default class CountTile extends React.Component {
  constructor(props) {
    super();

    // Set up dimensions and scales
    let width = props.width;
    let height = props.height;
    let {x_scale, y_scale} = get_scales(width, height, props.data);
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
      data   : props.data
    }
  }

  //componentWillRecieveProps(nextProps) {}

  render() {
    return (
      <Group>
        {this.state.data.map((d, i) => {
          return(<Bar
            fill={this.state.color(d.week)}
            stroke={null}
            x={this.state.x_scale(d.week)}
            y={this.state.y_scale(d.count)}
            width={this.state.x_scale.bandwidth()}
            height={this.state.height - this.state.y_scale(d.count)}
          />);
        })}
      </Group>
    );
  }
}