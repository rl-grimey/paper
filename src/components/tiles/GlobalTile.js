import React from 'react';
import { Group } from '@vx/group';
import { nest, sum } from 'd3';
import CommunityTile from './CommunityTile';


export default class GlobalTile extends React.Component {
  constructor(props) {
    super();
    this.state = {
      width: props.width,
      height: props.height,
      data: {},
      chart: props.chart,
      view: props.view
    };

    this.sum_topic_data = this.sum_topic_data.bind(this);
    this.create_chart = this.create_chart.bind(this);
  }

  componentWillReceiveProps(props) { this.setState({ ...props }); }

  sum_topic_data() {
    /* Sums our weekly topic data */
    let states = this.state.data;
    let nation = [];

    // Add state community/week count
    for (var state_fips in states) {
      let state = states[state_fips];
      let community_data = state['communities'];

      for (var week in community_data) {
        var week_comm_data = community_data[week];
        week_comm_data.map(d => {
          d['week'] = week;
          nation.push(d);
        });
      }
    }

    let flat_data = [].concat.apply([], nation);
    let grouped_data = nest()
      .key(d => d.week)
      .key(d => d.community)
      .rollup(v => sum(v, d => d.count))
      .object(flat_data);

    var weekly_max = 0;
    
    for (var week in grouped_data) {
      var week_data = grouped_data[week];
      var new_week_data = [];
      var week_cnt = 0;

      for (var comm in week_data) {
        week_cnt += week_data[comm];

        new_week_data.push({
          community: comm,
          count: week_data[comm],
          week: week
        });
      }

      // Create new perc%
      new_week_data.forEach(d => d.perc = d.count / week_cnt);
      grouped_data[week] = new_week_data;

      // Update weekly max
      weekly_max = Math.max(weekly_max, week_cnt);
    }

    return { grouped_data, weekly_max };
  }


  create_chart(chart) {
    let info = { name: 'United States' };

    switch(chart) {
      case 'topics':
        let { grouped_data, weekly_max } = this.sum_topic_data();
        return (
          <CommunityTile
            width={this.state.width}
            height={this.state.height}
            data={grouped_data}
            weekly_max={weekly_max}
            info={info}
            view={this.state.view}
            tweets={[]}
          />
        );
      default:
        return <Group></Group>
    }
  }

  render() {
    return (this.create_chart(this.state.chart));
  }
}