import React from 'react';
import { Group } from '@vx/group';
import { Bar } from '@vx/shape';

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
    let selected = this.props.selected_state === this.props.abbrv;
    let strokeHighlight = selected ? '#333333' : '#33333333';

    return (
      <Group
        top={this.state.top}
        left={this.state.left}
        id={"tile-" + this.state.abbrv}
        onClick={() => this.props.onClick(this.props.abbrv)}
      >
        <Bar
          className={'tile-bg'}
          fill={'none'}
          stroke={strokeHighlight}
          strokeWidth={1}
          width={this.state.width}
          height={this.state.height}
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