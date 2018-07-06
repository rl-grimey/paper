/**
 * Stacked bar chart of community counts/shares.
 */

import React from 'react';
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear } from '@vx/scale';
import { stack, color } from 'd3';
import { 
  weeks,
  week_labels,
  communities, 
  community_scale, 
  margin_grid,
  margin_modal
} from '../../utilities';
import ModalChart from '../widgets/ModalChart';


export default class CommunityTile extends React.Component {
  constructor(props) {
    super();

    // Set up dimensions and scales
    let { width, height, view } = props;
    let {x_scale, y_scale} = this.create_scales(width, height, view, props.weekly_max);
    
    this.state = {
      width      : width,
      height     : height,
      x_scale    : x_scale,
      y_scale    : y_scale,
      communities: communities,
      color      : community_scale,
      data       : props.data,
      view       : view,
      community  : props.community,
      weekly_max : props.weekly_max,
      info       : props.info,
      modal_open : false
    }

    this.modalRef = React.createRef();

    this.create_stack_data = this.create_stack_data.bind(this);
    this.create_scales     = this.create_scales.bind(this);
    this.render_bars       = this.render_bars.bind(this);
    this.render_modal      = this.render_modal.bind(this);
    this.render_chart      = this.render_chart.bind(this);
    this.render_axes       = this.render_axes.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    let { width, height, view } = nextProps;
    let { x_scale, y_scale } = this.create_scales(width, height, view, this.state.weekly_max);
    this.setState({ ...nextProps, width, height, view, x_scale, y_scale });
  }

  create_scales(width, height, view, weekly_max) {
    /* Creates scales based on DOM + data dimensions */
    let padding = (width > 200) ? 0.4 : 0.075;

    let x_scale = scaleBand({
      domain    : weeks,
      rangeRound: [1, width-1],
      padding   : padding
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
      range : [height-1, 1]
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
      this.state.communities.forEach(comm => { if (!week_data.hasOwnProperty(comm)) week_data[comm] = 0; });
      reshaped.push(week_data);
    }

   return stack().keys(community_scale.domain())(reshaped);
  }

  render_bars(week_dist, key, x_scale, y_scale) {
    /* Render's our stacked bars for a given week*/

    // Highlight selected community if a community is selected
    // Fill should only be opaque when community is selected
    // Stroke should only be present when community is selected
    let highlight = community => this.state.community !== null;
    let highlight_fill = community => highlight(community) ? (community === +this.state.community ? 1.0 : 0.5) : 1.0;
    let highlight_stroke = community => highlight(community) ? (community === +this.state.community ? 0.8 : 0) : 0;

    // Assign the fill and strokes
    let comm_color = color(community_scale(week_dist.key))
    comm_color.opacity = highlight_fill(week_dist.key);
    let comm_stroke = highlight_stroke(week_dist.key);

    return (
      <Group key={key} >
        {week_dist
          .filter(topic => (y_scale(topic[0]) - y_scale(topic[1]) > 0))
          .map((topic, i) => {
            return (
              <Bar
                key={i}
                x={x_scale(topic.data.week)}
                y={y_scale(topic[1])}
                width={x_scale.bandwidth()}
                height={y_scale(topic[0]) - y_scale(topic[1])}
                fill={comm_color}
                stroke={'#999999'}
                strokeWidth={comm_stroke}
                onClick={data => event => console.log(data, event, event.target)}
              />
            );
          })}
      </Group>
    );
  }

  render_chart(width, height, margin) {
    /* Renders our chart with dynamic dimensions. */
    let stacked_data = this.create_stack_data();

    // Create our scales with respect to our margins
    let { x_scale, y_scale } = this.create_scales(
      width - margin.left - margin.right, 
      height - margin.top - margin.bottom, 
      this.state.view, 
      this.state.weekly_max);

    return (
      <Group top={margin.top} left={margin.left}>
        {stacked_data.map((week, i) => this.render_bars(week, i, x_scale, y_scale))}
      </Group>
    );
  }

  render_axes(width, height) {
    /* Renders axes for our details on demand modal chart. */
    // Axis styles
    const stroke = '#666666';

    // Create our scales
    let { x_scale, y_scale } = this.create_scales(
      width - margin_modal.left - margin_modal.right, 
      height - margin_modal.top - margin_modal.bottom, 
      this.state.view,
      this.state.weekly_max);

    // And axes
    let x_axis = <AxisBottom
      scale={x_scale}
      top={height - margin_modal.top}
      left={margin_modal.left}
      stroke={stroke}
      tickStroke={stroke}
      tickFormat={(val, i) => week_labels(val)}
      label={'Weeks Before / After Travel Ban'}
    />

    let y_axis = <AxisLeft
      scale={y_scale}
      top={margin_modal.top}
      left={margin_modal.left}
      label={(this.state.view === 'absolute') ? 'Topic Tweet Counts' : 'Topic Contribution'}
      stroke={stroke}
      tickStroke={stroke}
      //Tick formatting!
    />

    return (
      <Group>
        {x_axis}
        {y_axis}
      </Group>
    );
  }

  render_modal() {
    /* Creates a modal chart with the normal size graph. */
    this.setState({ modal_open: !this.state.modal_open });
  }

  render() {
    // Create the data
    let stacked_data = this.create_stack_data();

    // Get tile dimensions
    let tile_width = this.state.width;
    let tile_height = this.state.height;

    // Get screen dimensions for modal chart
    let screen_width = window.innerWidth * 0.7;
    let screen_height = window.innerHeight * 0.7;

    return (
      <Group onClick={this.render_modal} >
        {this.render_chart(tile_width, tile_height, margin_grid)}

        <ModalChart
          open={this.state.modal_open}
          callback={this.render_modal}
          width={screen_width}
          height={screen_height}
          info={this.state.info}
          view={this.state.view}
          ref={this.modalRef}
        >
          {this.render_chart(screen_width, screen_height, margin_modal)}
          {this.render_axes(screen_width, screen_height)}
        </ModalChart>
      </Group>
    );
  }
}