import React from 'react';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';
import { Text } from '@vx/text';

export default class Gridtile extends React.Component {
  render() {


    return (
      <Group
        top={this.props.top}
        left={this.props.left}
        id={"tile-" + this.props.abbrv}
      >
        <Bar
          className={'tile-bg'}
          fill={'none'}
          stroke={this.props.cartoType === 'cluster' ?
            '#33333300' : '#33333333'}
          strokeWidth={1}
          width={this.props.width}
          height={this.props.height}
        />
        {this.props.children}
      </Group>
    );
  }
}