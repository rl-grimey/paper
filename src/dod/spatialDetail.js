import React from 'react';
import { Albers } from '@vx/geo';
import * as topojson from 'topojson-client';


export default class SpatialDetail extends React.Component {
  constructor(props) {
    super();

    this.state = {
      width: props.width,
      height: props.height,
      statefp: null,
      data: null
    };
  }
  
  render() {
    return (
      <svg
        width={this.state.width}
        height={this.state.height}
      >
      </svg>
    );
  }
}