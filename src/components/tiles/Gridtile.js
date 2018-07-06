import React from 'react';
import { Group } from '@vx/group';
import { Bar, Line } from '@vx/shape';
import { Point } from '@vx/point';

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
      selected: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Only update if width/view/state selection has changed. */
    let selected = this.state.selected;

    return (
      (nextProps.width !== this.state.width) ||
      (nextProps.view !== this.state.view) ||
      (nextProps.children !== this.state.children) || 
      ((selected === false) && (nextProps.selected_state === this.state.abbrv)) ||
      ((selected === true) && (nextProps.selected_state !== this.state.abbrv))
    );
  }

  componentWillReceiveProps(nextProps) {
    /* Check to see if state has been selected */
    let selected = nextProps.selected_state === this.state.abbrv;
    this.setState({ ...nextProps, selected });
  }



  render() {
    // Some double ternary logic for highlighting
    let selected = this.props.selected_state === this.state.abbrv;
    let strokeHighlight = selected ? '#333333' : '#33333333';

    // Dimensions to denote the travel ban date
    let mid_width = (this.state.width / 2) - 0;

    return (
      <Group
        top={this.state.top}
        left={this.state.left}
        id={"tile-" + this.state.abbrv}
        onClick={() => this.props.onClick(this.state.abbrv)}
      >
        <Bar
          className={'tile-bg'}
          fill={'none'}
          stroke={strokeHighlight}
          strokeWidth={1}
          width={this.state.width}
          height={this.state.height}
        />
        <Line
          from={new Point({ x: mid_width, y: this.state.height - 1})}
          to={new Point({ x: mid_width, y: 1})}
          stroke={'#5b5b5b'}
          strokeDasharray={'2 2'}
        />
        <rect
          width={this.state.width}
          height={this.state.height}
          fill={'#ffffff00'}
          stroke={'none'}
        />
        {this.props.children}
      </Group>
    );
  }
}