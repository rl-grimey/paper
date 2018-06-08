import React from 'react';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { Text } from '@vx/text';

export default class Gridtile extends React.Component {
  render() {
    // Some double ternary logic for highlighting
    let { selected } = this.props;
    let normal = this.props.cartoType === 'cluster' ? '#33333300':'#33333333';
    let strokeHighlight = selected ? '#333333' : normal;

    return (
      <Group
        top={this.props.top}
        left={this.props.left}
        id={"tile-" + this.props.abbrv}
      >
        <Bar
          className={'tile-bg'}
          fill={'none'}
          stroke={strokeHighlight}
          strokeWidth={2}
          width={this.props.width}
          height={this.props.height}
        />
        {this.props.children}
      </Group>
    );
  }
}