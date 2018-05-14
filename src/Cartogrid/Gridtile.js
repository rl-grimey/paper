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
          stroke={'#333333'}
          strokeWidth={1}
          width={this.props.width}
          height={this.props.height}
        />
        
        <Text
          fontSize={10}
          fontWeight={'bold'}
          fontFamily={'sans-serif'}
          textAnchor={'end'}
          dx={this.props.width * 0.85}
          dy={this.props.height * -0.25}
        >
          {this.props.abbrv}
        </Text>
        {this.props.children}
      </Group>
    );
  }
}