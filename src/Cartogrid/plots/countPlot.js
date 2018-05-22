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
    let { width, height, colorScale, data, maxCount } = this.props;

    const x_scale = scaleBand()
      .domain([-4, -3, -2, -1, 1, 2, 3, 4])
      .range([0, width])
      .paddingOuter(0.3)
      .paddingInner(0.2);

    const y_scale = scalePow()
      .exponent(2)
      .domain([0, max(data, d => d.count)])
      .range([height, 0]);

    return (
      <Group onClick={this.props.clickCallback} >
        {data.map((d, i) => {
          return (
            <Group key={i}>
              <Bar
                className={d.period + ' ' + d.statefp}
                fill={colorScale(d.period)}
                stroke={null}
                strokeWidth={1}
                x={x_scale(d.period)}
                y={y_scale(d.count)}
                width={x_scale.bandwidth()}
                height={y_scale(0) - y_scale(d.count)}
              />
              <AxisBottom
                scale={x_scale}
                top={height}
                numTicks={2}
                hideAxisLine={true}
                tickLength={3}
              />
              {/*<AxisLeft
                scale={y_scale}
                numTicks={4}
                tickLength={3}
                tickFormat={format(".00%")}
              />*/}
            </Group>              
          );
        })}
      </Group>
    );
  }
}
