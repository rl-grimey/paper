/**
 * Bar chart of weekly state tweet counts.
 */

import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { max } from 'd3';

/* Scale utility */
const weeks = [-4, -3, -2, -1, 1, 2, 3, 4];
const get_scales = (width, height, data) => {
  /** Creates X+Y scales for sentiment data.
   *  Each state = {
   *  positive: [{week: w, count: n, perc: p}, ...],
   *  negative: [...]
   * }
   */
  let x_scale = scaleBand({
    domain    : weeks,
    rangeRound: [1, width-1],
    padding   : 0.05
    // TickFormatting
  })

  // Get largest value of either positive or negative
  // Use that as our max, so we can 'double' it and
  // mirror the bars over the horizontal middle of chart
  let max_pos = max(data.positive, d => d.count);
  let max_neg = max(data.negative, d => d.count);

  let y_scale = scaleLinear({
    domain: [0, Math.max(max_pos, max_neg)],
    range : [1, height/2],
    nice  : true
  })

  return { x_scale, y_scale };
}

export default class SentTile extends React.Component {
  constructor(props) {
    super();

    // Set up dimensions and scales
    let width = props.width;
    let height = props.height;
    let {x_scale, y_scale} = get_scales(width, height, props.data);
    let color = scaleOrdinal({
      domain: ['negative', 'positive'],
      range : ['#b2182b', '#2166ac']
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
    // Find midpoint for diverging bars
    let mid = this.state.height / 2;

    return (
      <Group>
        {this.state.data.positive.map((d, i) => {
          return (<Bar
            key={i}
            x={this.state.x_scale(d.week)}
            width={this.state.x_scale.bandwidth()}
            y={mid - this.state.y_scale(d.count)}
            height={this.state.y_scale(d.count)}
            fill={this.state.color('positive')}
          />);
        })}
        {this.state.data.negative.map((d, i) => {
          return (<Bar
            key={i}
            x={this.state.x_scale(d.week)}
            width={this.state.x_scale.bandwidth()}
            y={mid}
            height={this.state.y_scale(d.count)}
            fill={this.state.color('negative')}
          />);
        })}
      </Group>
    );
  }
}