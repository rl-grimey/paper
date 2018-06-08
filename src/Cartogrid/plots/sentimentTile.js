import React from 'react';
import { mean, max } from 'd3-array';

import { Group } from '@vx/group';
import { Grid } from '@vx/grid';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { AreaClosed, LinePath, Line } from '@vx/shape';
import { scaleLinear } from '@vx/scale';
import { curveBasis } from '@vx/curve';

export default class SentimentTile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.kernelDensityEstimator = this.kernelDensityEstimator.bind(this);
    this.kernelEpanechnikov = this.kernelEpanechnikov.bind(this);
  }

  kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }
  
  kernelEpanechnikov(k) {
    return function(v) {
      return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k: 0;
    };
  }

  calcKernel(data, k, ticks) { 
    return this.kernelDensityEstimator(this.kernelEpanechnikov(k), ticks)(data); 
  }

  render() {
    const color = this.props.colorScale;
    const x = scaleLinear({
      domain: [-1, 1],
      range: [0, this.props.width]
    });
    const k = 0.075;

    // Calc distributions
    const beforePosKDE = this.calcKernel(this.props.beforePos, k, x.ticks(100));
    const beforeNegKDE = this.calcKernel(this.props.beforeNeg, k, x.ticks(100));
    const afterPosKDE  = this.calcKernel(this.props.afterPos, k, x.ticks(100));
    const afterNegKDE  = this.calcKernel(this.props.afterNeg, k, x.ticks(100));

    const flatKDE = [].concat.apply([], [beforeNegKDE, beforePosKDE, afterNegKDE, afterPosKDE])
    const maxKDE = max(flatKDE.map(d => d[1]));
    const y = scaleLinear({
      domain: [0, maxKDE],
      range: [this.props.height, 0]
    });


    return (
      <Group>
        <AreaClosed
          x={d => d[0]}
          y={d => d[1]}
          xScale={x}
          yScale={y}
          data={beforePosKDE}
          curve={curveBasis}
          strokeWidth={1}
          stroke={color(-1)}
          fill={color(-1)}
          defined={d => (d[0] && d[1]) && (d[0] > 0.33)}
        />
        <AreaClosed
          x={d => d[0]}
          y={d => d[1]}
          xScale={x}
          yScale={y}
          data={beforeNegKDE}
          curve={curveBasis}
          strokeWidth={1}
          stroke={color(-1)}
          fill={color(-1)}
          defined={d => (d[0] < -0.33) && (d[0] && d[1])}
        />
        <AreaClosed
          x={d => d[0]}
          y={d => d[1]}
          xScale={x}
          yScale={y}
          data={afterPosKDE}
          curve={curveBasis}
          strokeWidth={1}
          stroke={color(1)}
          fill={color(1)}
          defined={d => (d[0] && d[1]) && (d[0] > 0.33)}
        />
        <AreaClosed
          x={d => d[0]}
          y={d => d[1]}
          xScale={x}
          yScale={y}
          data={afterNegKDE}
          curve={curveBasis}
          strokeWidth={1}
          stroke={color(1)}
          fill={color(1)}
          defined={d => (d[0] < -0.33) && (d[0] && d[1])}
        />
      </Group>
    );
  }
}
