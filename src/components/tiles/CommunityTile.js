/**
 * Stacked bar chart of community counts/shares.
 */

import React from 'react';
import { BarStack } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@vx/scale';
import { max, sum } from 'd3';

/* Scale utility */
const keys = [-1, 0, 1, 2, 3, 4];

export default class CommunityTile extends React.Component {
  constructor(props) {
    super();

    // Set up dimensions and scales
    let width = props.width;
    let height = props.height;
    let view = props.view;
    let {x_scale, y_scale} = this.create_chart_scales(width, height, view, props.weekly_max);
    
    let color = scaleOrdinal({
      domain: keys,
      range: ['#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f']
    });
    
    this.state = {
      width: width, 
      height: height, 
      x_scale: x_scale, 
      y_scale: y_scale,
      keys: keys,
      color: color,
      data: props.data,
      view: view,
      weekly_max: props.weekly_max
    }

    this.create_stack_data = this.create_stack_data.bind(this);
    this.create_chart_scales = this.create_chart_scales.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { width, height, view } = nextProps;
    let { x_scale, y_scale } = this.create_chart_scales(width, height, view, this.state.weekly_max);
    this.setState({ width, height, view, x_scale, y_scale });
  }

  create_chart_scales(width, height, view, weekly_max) {
    let x_scale = scaleBand({
      domain    : [-4, -3, -2, -1, 1, 2, 3, 4],
      rangeRound: [1, width-1],
      padding   : 0.00
      // TickFormatting
    })

    /* Get the max value of our data.
        - 'absolute': count values of each community
        - 'relative': Percentage of values for each community (P=1.0)
    */
    let y_max;
    if (view === 'absolute') y_max = weekly_max;
    else y_max = 1;

    let y_scale = scaleLinear({
      domain: [0, y_max],
      range : [height-1, 1],
      nice  : true
    })
  
    return { x_scale, y_scale };
  }

  create_stack_data() {
    /*Reformat the data from an array of community counts objects
      to the needed object with key: value pairs.
      [{comm: 1, cnt: 10}, ...] => {week: wk, 1: 10, 2: 3} */

    // Determine which attribute we should be using in our stacks
    // absolute: count, relative: perc
    let view_attr = (this.state.view === 'absolute') ? 'count' : 'perc';

    let reshaped = [];
    for (var week in this.state.data) {
      // Add each weekly community count to week object
      let week_data = {week: week};
      this.state.data[week].forEach(d => week_data[d.community] = d[view_attr]);

      // Add any missing communities
      this.state.keys.forEach(comm => { if (!week_data.hasOwnProperty(comm)) week_data[comm] = 0; });
      reshaped.push(week_data);
    }

   return reshaped;
  }

  render() {
    return (
      <Group>
        <BarStack
          top={0}
          data={this.create_stack_data()}
          keys={this.state.keys}
          height={this.state.height}
          x={d => d.week}
          xScale={this.state.x_scale}
          yScale={this.state.y_scale}
          zScale={this.state.color}
          stroke={'1px #ffffff'}
        />
      </Group>
    );
  }
}