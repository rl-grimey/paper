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

    // Calculate distributions *ONCE*, params
    const x = scaleLinear({
      domain: [-1, 1],
      range: [0, this.props.width]
    });
    const k = props.kernelSize;

    // Actually calc the distributions
    const beforePosKDE = this.calcKernel(this.props.beforePos, k, x.ticks(100));
    const beforeNegKDE = this.calcKernel(this.props.beforeNeg, k, x.ticks(100));
    const afterPosKDE  = this.calcKernel(this.props.afterPos, k, x.ticks(100));
    const afterNegKDE  = this.calcKernel(this.props.afterNeg, k, x.ticks(100));

    // Find max density for better scaling
    const flatKDE = [].concat.apply([], [beforeNegKDE, beforePosKDE, afterNegKDE, afterPosKDE])
    const maxKDE = max(flatKDE.map(d => d[1]));

    // Only display axes on the following states
    let stateAxes = new Set([
      'AK', 'CA', 'HI', 'AZ', 'NM', 'TX',
      'LA', 'MS', 'AL', 'GA', 'FL', 'DC', 'DE',
      'RI', 'NH'
    ]);

    this.state = {
      beforePosKDE,
      beforeNegKDE,
      afterPosKDE,
      afterNegKDE,
      maxKDE,
      statefp: props.statefp,
      kernelSize: props.kernelSize,
      showAxis: stateAxes.has(props.abbrv),
      width: this.props.width,
      height: this.props.height
    };

    this.kernelDensityEstimator = this.kernelDensityEstimator.bind(this);
    this.kernelEpanechnikov = this.kernelEpanechnikov.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Only update component if kernel size has changed, or dimensions
    let propsChange = ((nextProps.kernelSize !== this.state.kernelSize) &&
      (nextProps.width !== this.state.width) && 
      (nextProps.height !== this.state.height));
    return propsChange;
  }

  componentWillReceiveProps(nextProps) {
    // Calculculate the new densities
    const x = scaleLinear({
      domain: [-1, 1],
      range: [0, nextProps.width]
    });
    const k = nextProps.kernelSize;

    // Actually calc the distributions
    const beforePosKDE = this.calcKernel(nextProps.beforePos, k, x.ticks(100));
    const beforeNegKDE = this.calcKernel(nextProps.beforeNeg, k, x.ticks(100));
    const afterPosKDE  = this.calcKernel(nextProps.afterPos, k, x.ticks(100));
    const afterNegKDE  = this.calcKernel(nextProps.afterNeg, k, x.ticks(100));

    // Find max density for better scaling
    const flatKDE = [].concat.apply([], [beforeNegKDE, beforePosKDE, afterNegKDE, afterPosKDE])
    const maxKDE = max(flatKDE.map(d => d[1]));

    this.setState({
      width: nextProps.width,
      height: nextProps.height,
      kernelSize: nextProps.kernelSize,
      beforePosKDE,
      beforeNegKDE,
      afterPosKDE,
      afterNegKDE,
      maxKDE
    });
  }

  kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(function(x) {
        return [x, mean(V, function(v) { return kernel(x - v); })];
      });
    };
  }
  
  // Replace w/ Gaussian? 
  //https://gist.github.com/curran/b595fde4d771c5784421
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
      domain: [-1.1, 1.1],
      range: [0, this.props.width]
    });
    const xTicks = x.tickFormat(".1");

    const y = scaleLinear({
      domain: [0, this.state.maxKDE],
      range: [this.props.height, 0]
    });

    // Only display axes on the following states
    let stateAxes = new Set([
      'AK', 'CA', 'HI', 'AZ', 'NM', 'TX',
      'LA', 'MS', 'AL', 'GA', 'FL', 'DC', 'DE',
      'RI', 'NH'
    ]);

    const groupStyles = { "isolation": "isolate" };
    const inlineStyles = { "mixBlendMode": "multiply" };
    return (
      <Group style={groupStyles} onClick={this.props.clickCallback}>  
        <AreaClosed
          x={d => d[0]}
          y={d => d[1]}
          xScale={x}
          yScale={y}
          data={this.state.beforePosKDE}
          curve={curveBasis}
          strokeWidth={1}
          stroke={color(-1)}
          fill={color(-1)}
          defined={d => (d[0] && d[1]) && (d[0] > 0.33)}
          className={'distributions'}
        />
        <AreaClosed
          x={d => d[0]}
          y={d => d[1]}
          xScale={x}
          yScale={y}
          data={this.state.beforeNegKDE}
          curve={curveBasis}
          strokeWidth={1}
          stroke={color(-1)}
          fill={color(-1)}
          defined={d => (d[0] < -0.33) && (d[0] && d[1])}
          className={'distributions'}
        />
        <AreaClosed
          x={d => d[0]}
          y={d => d[1]}
          xScale={x}
          yScale={y}
          data={this.state.afterPosKDE}
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
          data={this.state.afterNegKDE}
          curve={curveBasis}
          strokeWidth={1}
          stroke={color(1)}
          fill={color(1)}
          defined={d => (d[0] < -0.33) && (d[0] && d[1])}
        />
        {this.state.showAxis && <AxisBottom
          scale={x}
          top={this.props.height}
          left={0}
          stroke="#33333333"
          tickStroke="#33333366"
          hideAxisLine={true}
          rangePadding={20}
          numTicks={3}
          tickLength={3}
          tickValues={[-1, 0, 1]}
          tickFormat={xTicks}
          tickClassName={'grid-ticks'}
        />}
        <rect
          x={0}
          y={0}
          width={this.props.width}
          height={this.props.height}
          fill={'#ffffff00'}
          stroke={'none'}
          className={this.state.statefp}
        />
      </Group>
    );
  }
}
