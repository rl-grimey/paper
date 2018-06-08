import React from 'react';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { 
  scaleBand, 
  scaleLinear,
  scaleThreshold,
  scalePow
} from 'd3-scale';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { max } from 'd3-array';
import { format } from 'd3-format';



export default class CountTile extends React.Component {
  render() {
    let { width, height, colorScale, data, maxCount, abbrv } = this.props;

    const x_scale = scaleBand()
      .domain([-4, -3, -2, -1, 1, 2, 3, 4])
      .range([0, width])
      .paddingOuter(0.3)
      .paddingInner(0.2);

    const y_scale = scalePow()
      .exponent(2)
      .domain([0, max(data, d => d.count)])
      //.domain([0, maxCount])
      .range([height, 0]);

    // Only display axes on the following states
    let stateXAxes = new Set([
      'AK', 'CA', 'HI', 'AZ', 'NM', 'TX',
      'LA', 'MS', 'AL', 'GA', 'FL', 'DC', 'DE',
      'RI', 'NH'
    ]);
    let showXAxes = stateXAxes.has(abbrv);
    let stateYAxes = new Set([]);

    return (
      <Group onClick={this.props.clickCallback} >
        {data.map((d, i) => {
          
          return (
            <Group key={i}>
              <Bar
                fill={colorScale(d.period)}
                stroke={null}
                strokeWidth={1}
                x={x_scale(d.period)}
                y={y_scale(d.count)}
                width={x_scale.bandwidth()}
                height={y_scale(0) - y_scale(d.count)}
              />
              {showXAxes &&
                <AxisBottom
                  scale={x_scale}
                  top={height}
                  hideAxisLine={true}
                  tickLength={3}
                  numTicks={4}
                  stroke={'#33333333'}
                  tickStroke={'#33333366'}
                  tickValues={[-4, -2, 2, 4]}
                  tickClassName={'grid-ticks'}
                />
              }
              {/*<AxisLeft
                scale={y_scale}
                numTicks={4}
                tickLength={3}
                tickFormat={format(".00%")}
              />*/}
              <rect
                x={0}
                y={0}
                width={this.props.width}
                height={this.props.height}
                fill={'#ffffff00'}
                stroke={'none'}
                onClick={() => console.log(d.statefp)}
                className={d.period + ' ' + d.statefp}
              />
            </Group>              
          );
        })}
      </Group>
    );
  }
}
