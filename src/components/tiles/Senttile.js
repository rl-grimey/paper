/**
 * Bar chart of weekly state tweet counts.
 */

import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { max, stack } from 'd3';
import { weeks } from '../../utilities';


export default class SentTile extends React.Component {
  constructor(props) {
    super();

    // Set up dimensions and scales
    let { width, height, view, data } = props;
    let { x_scale, y_scale } = this.create_chart_scales(width, height, view, data);
    let color = scaleOrdinal({
      domain: ['negative', 'positive'],
      range : ['#ef8a62', '#67a9cf']
    })
    
    this.state = {
      width  : width,
      height : height,
      x_scale: x_scale,
      y_scale: y_scale,
      weeks  : weeks,
      color  : color,
      data   : props.data,
      view   : view
    }

    this.create_chart_scales = this.create_chart_scales.bind(this);
    this.create_stack_data = this.create_stack_data.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { width, height, view } = nextProps;
    let { x_scale, y_scale } = this.create_chart_scales(width, height, view, this.state.data);
    this.setState({ width, height, view, x_scale, y_scale });
  }

  create_chart_scales(width, height, view, data) {
    /** Creates X+Y scales for sentiment data.
     *  Each state = {
     *  positive: [{week: w, count: n, perc: p}, ...],
     *  negative: [...]
     * }
     */

    // Create padding based on chart size
    let padding = (width > 200) ? 0.4 : 0.075;

    let x_scale = scaleBand({
      domain    : weeks,
      rangeRound: [1, width-1],
      padding   : padding
      // TickFormatting
    })

    // Conditionally set the view of our data
    let view_attr = (view === 'absolute') ? 'count' : 'perc';

    // Get largest value of either positive or negative
    // Use that as our max, so we can 'double' it and
    // mirror the bars over the horizontal middle of chart
    let max_pos = max(data.positive, d => d[view_attr]);
    let max_neg = max(data.negative, d => d[view_attr]);

    let y_scale = scaleLinear({
      domain: [0, Math.max(max_pos, max_neg)],
      range : [1, height/2],
      nice  : true
    })

    return { x_scale, y_scale };
  }

  create_stack_data() {
    /* Creates our stack */
    // Determine which attribute to use
    let view_attr = (this.state.view === 'absolute') ? 'count' : 'perc';
    let reshaped = {};

    // Add positives
    for (var pos_week in this.state.data.positive) {
      let week_data = this.state.data.positive[pos_week];
      let week = week_data.week;

      if (week in reshaped) reshaped[week]['positive'] = week_data[view_attr];
      else {
        reshaped[week] = {};
        reshaped[week]['positive'] = week_data[view_attr];
      }
    }

    // Add negatives
    for (var pos_week in this.state.data.negative) {
      let week_data = this.state.data.negative[pos_week];
      let week = week_data.week;

      if (week in reshaped) reshaped[week]['negative'] = week_data[view_attr];
      else {
        reshaped[week] = {};
        reshaped[week]['negative'] = week_data[view_attr];
      }
    }

    // Reshape object to array
    let final = Object.entries(reshaped).map(d => {
      let week_vals = d[1];
      week_vals['week'] = +d[0];
      return week_vals;
    })
    

    return stack().keys(['positive', 'negative'])(final);
  }

  render_bars(week, key, x_scale, y_scale) {
    /* Renders bars */
    

    return (
      <Group>

      </Group>
    );
  }

  render_chart(width, height, margin) {
    /* Renders our chart */
    let stack_data = this.create_stack_data();

    let { x_scale, y_scale } = this.create_chart_scales(
      width,
      height,
      this.state.view,
      this.state.data);

    
  }

  render() {
    // Find midpoint for diverging bars
    let mid = this.state.height / 2;

    // Conditionally set the data attribute we'll use
    let view_attr = (this.state.view === 'absolute') ? 'count' : 'perc';

    return (
      <Group>
        {this.state.data.positive.map((d, i) => {
          return (<Bar
            key={i}
            x={this.state.x_scale(d.week)}
            width={this.state.x_scale.bandwidth()}
            y={mid - this.state.y_scale(d[view_attr])}
            height={this.state.y_scale(d[view_attr])}
            fill={this.state.color('positive')}
          />);
        })}
        {this.state.data.negative.map((d, i) => {
          return (<Bar
            key={i}
            x={this.state.x_scale(d.week)}
            width={this.state.x_scale.bandwidth()}
            y={mid}
            height={this.state.y_scale(d[view_attr])}
            fill={this.state.color('negative')}
          />);
        })}
      </Group>
    );
  }
}