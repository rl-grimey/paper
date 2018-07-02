import React from 'react';
import { Group } from '@vx/group';
import { Grid } from '@vx/grid';
import { Bar, Line } from '@vx/shape';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { scaleBand, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';

export default class SentimentBars extends React.Component {
  constructor(props) {
    super(props);

    // Only display axes on the following states
    let stateAxes = new Set([
      'AK', 'CA', 'HI', 'AZ', 'NM', 'TX',
      'LA', 'MS', 'AL', 'GA', 'FL', 'DC', 'DE',
      'RI', 'NH'
    ]);

    this.state = {
      positive: props.positive,
      negative: props.negative,
      total   : props.total,
      scale   : props.scale,
      statefp : props.statefp,
      showAxis: stateAxes.has(props.abbrv),
      width   : this.props.width,
      height  : this.props.height
    };

    // Bind function to component
    this.createXScale = this.createXScale.bind(this);
    this.hasXAxes     = this.hasXAxes.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      width: nextProps.width,
      height: nextProps.height
    });
  }

  createXScale(width) {
    const xScale = scaleBand({
      domain    : [-4, -3, -2, -1, 1, 2, 3, 4],
      rangeRound: [0, width],
      padding   : 0.4
    })
    return xScale;
  }

  createYScale(height) {
    // Calculate the max count of each state
    let maxPositive = max(this.state.positive, d => d.count);
    let maxNegative = max(this.state.negative, d => d.count);

    let yScale = scaleLinear({
      domain: [0, Math.max(maxPositive, maxNegative)],
      range : [0, this.props.height / 2]
    });
    return yScale;
  }

  hasXAxes(abbrv) {
    // Only display axes on the following states
    let stateAxes = new Set([
      'AK', 'CA', 'HI', 'AZ', 'NM', 'TX',
      'LA', 'MS', 'AL', 'GA', 'FL', 'DC', 'DE',
      'RI', 'NH'
    ]);

    return stateAxes.has(abbrv);
  }


  render() {
    // Scales
    const color  = this.props.colorScale;
    const xScale = this.createXScale(this.state.width);
    const yScale = this.createYScale(this.state.height);
  

    // Midpoint in chart
    let mid = this.state.height / 2;
    
    // SVG transformations
    let scale = 'scale(' + this.state.scale + ')';
    let translate = 'translate(' + Math.round(this.state.height * this.state.scale) +','+ 
      Math.round(this.props.width * this.state.scale) + ')';
    console.log(translate);

    return (
      <Group 
        onClick={this.props.clickCallback}
      >
        <rect
          x={0}
          y={0}
          width={this.props.width}
          height={this.props.height}
          fill={'#e6e6e6'}
          stroke={'none'}
          className={this.state.statefp}
        />
        <Group 
          transform={translate + scale}
        >
          <Line
            from={{x: 0, y: mid}}
            to={{x: this.state.width, y: mid}}
            stroke={'#33333366'}
            strokeDasharray={'3'}
          />
          {this.state.positive.map((d, i) => {
            return (<Bar
              key={i}
              width={xScale.bandwidth()}
              height={yScale(d.count)}
              x={xScale(d.week)}
              y={mid - yScale(d.count)}
              fill={color('positive')}
            />);
          })}
          {this.state.negative.map((d, i) => {
            return (<Bar
              key={i}
              width={xScale.bandwidth()}
              height={yScale(d.count)}
              x={xScale(d.week)}
              y={mid}
              fill={color('negative')}
            />);
          })}
          {this.state.showAxis && <AxisBottom
            scale={xScale}
            top={this.props.height}
            left={0}
            stroke="#33333333"
            tickStroke="#33333366"
            hideAxisLine={true}
            rangePadding={20}
            numTicks={4}
            tickLength={3}
            tickValues={[-4, -2, 2, 4]}
            tickClassName={'grid-ticks'}
          />}
        </Group>
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
