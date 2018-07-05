/**
 * Creates a legend for our different charts.
 */

import React from 'react';
import { format } from 'd3-format';
import { community_scale } from '../../utilities';


const twoDecimalFormat = format('.2f');

export default class CartoLegend extends React.Component {
  constructor(props) {
    super();
    this.state = {
      chart: props.chart,
      communities: community_scale
    }

    this.create_community_legend = this.create_community_legend.bind(this);
  }

  create_community_legend() {
    return (<div></div>);
  }


  render() {
    return this.create_community_legend();
  }
}