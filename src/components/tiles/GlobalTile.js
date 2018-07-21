import React from 'react';
import { Group } from '@vx/group';
import { nest, sum } from 'd3';

import CommunityTile from './CommunityTile';
import SentTile from './Senttile';
import CountTile from './Counttile';

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
    this.sum_sent_data  = this.sum_sent_data.bind(this);
    this.sum_dist_data  = this.sum_dist_data.bind(this);
    this.create_chart   = this.create_chart.bind(this);
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

  sum_sent_data() {
    /* Sums our weekly sent data */
    let states = this.state.data;
    let nation = {
      positive: [],
      negative: []
    };
    let pop17 = 0;

    for (var state_fips in states) {
      let sents = states[state_fips].sentiments;

      pop17 += states[state_fips].info.pop17;
      
      sents.positive.forEach(d => nation.positive.push(d));
      sents.negative.forEach(d => nation.negative.push(d));
    }

    let weekly_max = 0;
    for (var sent in nation) {
      var grouped_sent = nest()
        .key(d => d.week)
        .rollup(v => sum(v, d => d.count))
        .entries(nation[sent]);

      grouped_sent = grouped_sent.map(d => {
        weekly_max = Math.max(d.value, weekly_max);

        return {
          week: d.key,
          count: d.value
        };
      })

      nation[sent] = grouped_sent;
    }

    // Add percentage of discourse
    let total_sents = {};
    for (var week in nation.positive) total_sents[week] = nation.positive[week].count;
    for (var week in nation.negative) total_sents[week] += nation.negative[week].count;
    for (var week in nation.positive) nation.positive[week].perc = nation.positive[week].count / total_sents[week];
    for (var week in nation.negative) nation.negative[week].perc = nation.negative[week].count / total_sents[week];

    return { grouped_data: nation, weekly_max };
  }

  sum_dist_data() {
    /* Sums our count data */
    let states = this.state.data;
    let nation = [];
    let pop17 = 0;
    let weekly_max = 0;

    for (var state_fips in states) {
      pop17 += states[state_fips].info.pop17

      var counts = states[state_fips].counts;
      counts.forEach(d => nation.push(d));
    }

    let grouped_data = nest()
      .key(d => d.week)
      .rollup(v => sum(v, d => d.count))
      .entries(nation);

    // Weekly max
    grouped_data.forEach(d => weekly_max = Math.max(d.value, weekly_max));

    // Add tweet rate
    grouped_data = grouped_data.map(d => {
      return {
        week: d.key,
        count: d.value,
        rate: (d.value / pop17) * 10
      };
    })

    return {grouped_data, weekly_max};
  }

  create_chart() {
    let info = { name: 'United States' };
    let { width, height, chart, view } = this.state;

    switch(chart) {
      case 'topics':
        var { grouped_data, weekly_max } = this.sum_topic_data();
        return (
          <CommunityTile
            width={width}
            height={height}
            data={grouped_data}
            weekly_max={weekly_max}
            info={info}
            view={view}
            tweets={[]}
          />
        );
      case 'sents':
        var { grouped_data, weekly_max } = this.sum_sent_data();
        return (
          <SentTile
            width={width}
            height={height}
            data={grouped_data}
            weekly_max={weekly_max}
            view={view}
          />
        );
      case 'counts':
        var { grouped_data, weekly_max } = this.sum_dist_data();
        return (
          <CountTile
            width={width}
            height={height}
            data={grouped_data}
            weekly_max={weekly_max}
            view={view}
          />
        );
      default:
        return <Group></Group>
    }
  }

  render() {
    this.sum_dist_data();

    return (this.create_chart());
  }
}