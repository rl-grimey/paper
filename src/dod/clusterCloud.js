import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import { 
  scaleLinear, 
  scaleLog, 
  scalePow 
} from 'd3-scale';

export default class ClusterCloud extends React.Component {
  constructor() {
    super();
    this.state = {
      data: undefined,
      cluster: undefined
    }
  }

  /* Prevent word clouds from rerendering every interaction. */
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    //console.log(prevState);
    //console.log(nextProps);
    //const cluster = (nextProps.cluster === prevState.cluster) ? prevState.cluster : nextProps.cluster;
    return {
      ...prevState,
      ...nextProps
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
      .range([8, 22]);

    const fontSizeMapper = word => {
      return (word.value === 1) ? 12 : fontScale(word.value);
    }


    let colorScale = this.props.colorScale;
    let divStyle = {
      'backgroundColor': colorScale(this.props.cluster),
      'padding': '10px'
    };

    console.log(this.props, this.state);

    return (
      <div style={divStyle}>
        <b>Cluster {this.props.cluster}</b>
        {cluster_tokens ? (
          <WordCloud
            data={cluster_tokens}
            fontSizeMapper={fontSizeMapper}
            width={this.props.width}
            height={this.props.height}
            font={'sans-serif'}
          />
          ) : (
            <div></div>
        )}
      </div>
    );
  }
}