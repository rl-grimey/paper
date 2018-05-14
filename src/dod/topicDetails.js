import React from 'react';
import { Group } from '@vx/group';
import { BoxPlot } from '@vx/boxplot';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';

export default class TopicDetails extends React.Component {
  constructor(props) {
    super();
    this.state = {
      topic: null,
      data: null,
      width: props.width,
      height: props.height,
      margin: props.margin
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {...prevState, ...nextProps};
  }

  render() {

    // Create subset of data
    let width = this.state.width || 100;
    let height = this.state.height || 100;

    // Set up fresh scales, axes
    const x_scale = scaleLinear({
      domain: [0, 100],
      range: [0, width * 0.9]
    });
    const y_scale = scaleBand({
      domain: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      rangeRound: [height * 0.9, 0]
    });
    
    return (
      <svg
        width={this.state.width}
        height={this.state.height}
      >
        <AxisLeft
          label={'Topic Keyword'}
          scale={y_scale}
          top={y_scale.domain()[1]}
          left={width * 0.1}
          stroke={'#333333'}
          tickStroke={'#555555'}
        />
        <AxisBottom
          label={'Prob/Count/xxx...'}
          scale={x_scale}
          top={height - (height * 0.1)}
          left={width * 0.1}
          stroke={'#333333'}
          tickStroke={'#555555'}
        />
      </svg>
    );  
  }
}