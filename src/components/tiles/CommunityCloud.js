import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import { 
  scaleLinear, 
  scaleLog, 
  scalePow 
} from 'd3-scale';
import { extent } from 'd3-array';
import { community_scale } from '../../utilities';

export default class CommunityCloud extends React.Component {
  constructor(props) {
    super();

    this.state = {
      width: props.width,
      height: props.height,
      view: props.view,
      community: props.community,
      selected_community: props.selected_community,
      data: props.data
    };

    this.create_cloud_data = this.create_cloud_data.bind(this);
    this.create_cloud_scale = this.create_cloud_scale.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Only update if width has changed, view has changed, 
      or community selection is different. */

    let selected = this.state.selected_community === this.state.community;

    return (
      (nextProps.width !== this.state.width) ||
      (nextProps.view !== this.state.view) ||
        // Handle newly selected communities
        (
          (selected === false) &&          
          (nextProps.selected_community === this.state.community)
        ) ||
        // Handle deselected communities
        (
          (selected === true) &&
          (nextProps.selected_community !== this.state.community)
        )
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ ...nextProps });
  }

  create_cloud_data() {
    /* Extracts the top 20 community tokens. Formats for WordCloud<> */

    // Conditionally set the view, based on absolute (count) or relative (rank)
    let view_attr = (this.state.view === 'absolute') ? 'docs' : 'rank';

    // Select top 20 and format
    let top_20 = this.state.data.slice(0, 20).map(d => {
      return { text: d.word, value: d[view_attr] };
    });

    return top_20;
  }

  create_cloud_scale(sliced_data) {
    /* Creates a font scale depending on our view. */
    let absolute_scale = scaleLinear()
      .domain(extent(sliced_data.map(d => d.value)))
      .range([8, 28])
      .nice();

    let relative_scale = scaleLinear()
      .domain([1, 20])
      .range([28, 8])
      .nice();

    let font_size_mapper = (this.state.view === 'absolute') ?
      word => absolute_scale(word.value) :
      word => relative_scale(word.value);

    return font_size_mapper;
  }

  render() {
    let format_data = this.create_cloud_data()
    let font_scale = this.create_cloud_scale(format_data);
    let selected = this.state.selected_community === this.state.community;

    let styles = { 
      'background': community_scale(this.state.community),
      'border': (selected) ? '1px solid black' : 'none',
      'margin': '1px'
     };

    return (
      <div style={styles} onClick={() => this.props.onClick(this.state.community)}>
        <p className='text-center'><b>{this.state.community}</b></p>
        <WordCloud
          data={format_data}
          fontSizeMapper={font_scale}
          width={this.state.width}
          height={this.state.height}
          padding={2}
          font={'sans-serif'}
        />
      </div>      
    );
  }
}