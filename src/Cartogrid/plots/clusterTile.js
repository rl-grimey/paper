import React from 'react';
import { Group } from '@vx/group';
import { GlyphCircle } from '@vx/glyph';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { scaleBand, scaleLinear } from '@vx/scale';
import { extent, max } from 'd3-array';
import { Text } from '@vx/text';

export default class ClusterTile extends React.Component {
  render() {

    const y_scale = scaleLinear({
      domain: [0, 1],
      range: [0, this.props.height]
    });
    const x_scale = scaleBand({
      domain: ['Before', 'After'],
      range: [0, this.props.width]
    });
    const color_scale = this.props.colorScale;

    /* Conditionally render cluster tile, don't show singletons. */
    const singletons = new Set([2, 8, 9]);
    
    return (
      <Group>
        {!singletons.has(this.props.before) && this.props.before !== undefined &&
          <rect
            className={this.props.before + ' ' + this.props.statefp}
            x={0}
            width={(this.props.width / 2) - 1}
            height={this.props.height}
            fill={color_scale(this.props.before)}
            fillOpacity={+this.props.cluster === this.props.before ? 1.0 : 0.66}
            stroke={+this.props.cluster === this.props.before ? '#333333' : '#ffffff'}
            strokeWidth={1}
            onClick={this.props.clickCallback}
          />
        }
        {!singletons.has(this.props.after) && this.props.after !== undefined &&
          <rect
            className={this.props.after + ' ' + this.props.statefp}
            x={this.props.width / 2}
            width={(this.props.width / 2) - 1}
            height={this.props.height}
            fill={color_scale(this.props.after)}
            fillOpacity={+this.props.cluster === this.props.after ? 1.0 : 0.66}
            stroke={+this.props.cluster === this.props.after ? '#333333' : '#ffffff'}
            strokeWidth={1}
            onClick={this.props.clickCallback}
          />
        }
      </Group>
    );
  }
}