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
const get_scales = (width, height) => {
  let x_scale = scaleBand({
    domain    : [-4, -3, -2, -1, 1, 2, 3, 4],
    rangeRound: [1, width-1],
    padding   : 0.00
    // TickFormatting
  })

  // Need total tweets by week, max is max of sums

  let y_scale = scaleLinear({
    domain: [0, 1],
    range : [height-1, 1],
    nice  : true
  })

  return { x_scale, y_scale };
}

export default class CommunityTile extends React.Component {
  constructor(props) {
    super();

    // Set up dimensions and scales
    let width = props.width;
    let height = props.height;
    let {x_scale, y_scale} = get_scales(width, height);
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
      data: props.data
    }

    this.create_stack_data = this.create_stack_data.bind(this);
  }

  //componentWillRecieveProps(nextProps) {}

  create_stack_data() {
    /*Reformat the data from an array of community counts objects
      to the needed object with key: value pairs.
      [{comm: 1, cnt: 10}, ...] => {week: wk, 1: 10, 2: 3} */

    let reshaped = [];
    for (var week in this.state.data) {
      // Add each weekly community count to week object
      let week_data = {week: week};
      this.state.data[week].forEach(d => week_data[d.community] = d.perc);

      // Add any missing communities
      this.state.keys.forEach(wk => { if (!week_data.hasOwnProperty(wk)) week_data[wk] = 0; });
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