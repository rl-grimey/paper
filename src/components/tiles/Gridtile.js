import React from 'react';
import { Group } from '@vx/group';
import { Bar, Line } from '@vx/shape';
import { Point } from '@vx/point';
import { Text } from '@vx/text';

export default class Gridtile extends React.Component {
  constructor(props) {
    super();

    this.state = {
      width : props.width,
      height: props.height,
      top: props.top,
      left: props.left,
      chart : props.chart,
      abbrv : props.abbrv,
      view  : props.view,
      selected: false,
      hover: false
    }

    this.click = this.click.bind(this);    
    this.hover = this.hover.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Only update if width/view/state selection has changed. */
    let selected = this.state.selected;

    return (
      (nextProps.width !== this.state.width) ||
      (nextProps.view !== this.state.view) ||
      (nextProps.children !== this.state.children) || 
      (nextProps.hover !== this.state.hover) ||
      ((selected === false) && (nextProps.selected_state === this.state.abbrv)) ||
      ((selected === true) && (nextProps.selected_state !== this.state.abbrv))
    );
  }

  componentWillReceiveProps(nextProps) {
    /* Check to see if state has been selected */
    let selected = nextProps.selected_state === this.state.abbrv;
    this.setState({ ...nextProps, selected });
  }

  click() {
    /* Handles our hovering/clicking interactions for tile */
    this.setState({ hover: false });
    this.props.onClick(this.state.abbrv);
  }

  hover() {
    /* Conditional logic to render border on hover. */
    this.setState({ hover: false });
  }

  render() {
    // Some double ternary logic for highlighting
    let { selected, hover } = this.state;
    let strokeHighlight = (hover) ? '#333333' : '#33333333'; 

    // Dimensions to denote the travel ban date
    let mid_width = (this.state.width / 2) - 0;

    // Add the hover clearing callback to the children
    const childrenWithProps = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {hover: this.hover });
    });

    return (
      <Group
        top={this.state.top}
        left={this.state.left}
        id={"tile-" + this.state.abbrv}
        onClick={this.click}
        onMouseOver={() => this.setState({ hover: true })}
        onMouseOut={this.hover}
      >
        <Bar
          className={'tile-bg'}
          fill={'none'}
          stroke={strokeHighlight}
          strokeWidth={1}
          width={this.state.width}
          height={this.state.height}
        />
        {childrenWithProps}
        <Line
          from={new Point({ x: mid_width, y: this.state.height - 1})}
          to={new Point({ x: mid_width, y: 1})}
          stroke={'#5b5b5b'}
          strokeDasharray={'2 2'}
        />
        <Text
          fontSize={11}
          fontWeight={hover ? '700' : '500'}
          fontFamily={'sans-serif'}
          textAnchor={'end'}
          style={{'opacity': 0.8}}
          x={this.state.width * 0.9}
          y={this.state.height * 0.2}
        >{this.state.abbrv}
        </Text>
        <rect
          width={this.state.width}
          height={this.state.height}
          fill={'#ffffff00'}
          stroke={'none'}
          onClick={() => console.log(this.state.abbrv + ' clicked')}
        />
      </Group>
    );
  }
}