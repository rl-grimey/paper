import React from 'react';
import { render } from 'react-dom';
import WordCloud from 'react-d3-cloud';
import { color } from 'd3-color';
import { community_scale, community_labels } from '../../utilities';

export default class CommunityCloud extends React.Component {
  constructor(props) {
    super();

    this.state = {
      width             : props.width,
      height            : props.height,
      view              : props.view,
      community         : props.community,
      selected_community: props.selected_community,
      data              : props.data,
      scale             : props.scale
    };

    this.create_cloud_data = this.create_cloud_data.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    /* Only update if width has changed, view has changed, 
      or community selection is different. */
    return (
      (nextProps.width !== this.state.width) ||
      (nextProps.view !== this.state.view) ||
      (nextProps.selected_community !== this.state.selected_community)
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

  render() {
    let { community, selected_community } = this.state;

    // Create data and scale for wordcloud
    let format_data = this.create_cloud_data()
    let font_scale = word => this.props.scale(word.value);

    // Dont highlight + add borders if nothing is selected
    let valid_selection = selected_community !== null;
    let highlight = selected_community === community;

    // Dynamically set cloud color and opacity
    let topic_color = color(community_scale(community));
    if (valid_selection && !highlight) topic_color.opacity = 0.5

    // Inline JSX styles
    let styles = { 
      'background': topic_color,
      'outline': (highlight) ? '2px solid black' : 'none',
      'margin': '3px'
     };

    return (
      <div 
        style={styles} 
        onClick={() => this.props.onClick(community)}
      >
        <h5 className='text-center'><strong>{community_labels(community)}</strong></h5>
        <WordCloud
          data={format_data}
          fontSizeMapper={font_scale}
          width={this.state.width}
          height={this.state.height}
          padding={3}
          font={'sans-serif'}
        />
      </div>      
    );
  }
}

/*
let selected = this.state.selected_community === this.state.community;
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
*/