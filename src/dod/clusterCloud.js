import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import { 
  scaleLinear, 
  scaleLog, 
  scalePow 
} from 'd3-scale';

class Cloud extends React.Component {
  /* Prevent word clouds from rerendering every interaction. */
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    let { data, fontSizeMapper, width, height } = this.props;

    return (
      <WordCloud
        data={data}
        fontSizeMapper={fontSizeMapper}
        width={width}
        height={height}
        font={'sans-serif'}
        padding={2}
      />
    );
  }
}

export default class ClusterCloud extends React.Component {
  constructor() {
    super();
    this.state = {
      data: undefined,
      cluster: undefined,
      selected: false
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const selected = nextProps.selectedCluster === +nextProps.cluster;

    return {
      ...prevState,
      ...nextProps,
      selected
    }
  }


  render() {
    let cluster_tokens = undefined;

    if (this.props.cluster && this.state.data) {
      cluster_tokens = this.props.data[this.props.cluster].values;
    }

    const fontScale = scaleLog()
      .base(2)
      .domain([1, 447786])
      .range([6, 24]);

    const fontSizeMapper = word => {
      return (word.value === 1) ? 12 : fontScale(word.value);
    }

    let border = '2px solid ' + (this.state.selected ? 'black' : 'white' );

    let colorScale = this.props.colorScale;
    let divStyle = {
      'backgroundColor': colorScale(this.props.cluster),
      'padding': '10px',
      'border': border
    };

    return (
      <div 
        style={divStyle}
        onClick={this.props.onClick}
      >
        <b>Cluster {this.props.cluster}</b>
        {cluster_tokens ? (
          <Cloud
            data={cluster_tokens}
            fontSizeMapper={fontSizeMapper}
            width={this.props.width}
            height={this.props.height}
            font={'sans-serif'}
            padding={2}
          />
          ) : (
            <div></div>
        )}
      </div>
    );
  }
}