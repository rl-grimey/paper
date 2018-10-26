/* Dependencies */
import React from 'react';
import { Row } from 'react-bootstrap';
import { scaleSqrt, scaleBand, scaleQuantile } from 'd3';
import { entries, extent } from 'd3';
import CommunityCloud from './tiles/CommunityCloud';
import { communities, center_styles } from '../utilities';

export default class CommunityGrid extends React.Component {
  constructor(props) {
    super();

    this.state = {
      width      : props.width,
      height     : props.height,
      scale      : this.create_clouds_width(props.width, props.height),
      community  : props.community,
      communities: communities,
      view       : props.view,
      data       : {}
    }

    this.create_clouds_width = this.create_clouds_width.bind(this);
    this.create_cloud = this.create_cloud.bind(this);
    this.create_cloud_data = this.create_cloud_data.bind(this);
    this.create_intercloud_scale = this.create_intercloud_scale.bind(this);
  }

  componentDidMount() {
    /* Load our community data after component mounts */
    this.setState({ data: require('../data/communities.json') });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Update if data loaded
    if (nextState.data !== this.state.data) return true;

    // Update if view has changed
    if ((nextProps.view !== this.state.view) || 
        (nextProps.width !== this.state.width) ||
        (nextProps.height !== this.state.height) ||
        (nextProps.community !== this.state.community)) return true;
    else return false;
  }

  componentWillReceiveProps(nextProps) {
    /* Update the community, view, and dimensions */
    let scale = this.create_clouds_width(nextProps.width, nextProps.height);
    this.setState({ ...nextProps, scale });
  }

  create_clouds_width(width, height) {
    /* Creates a scale to fit our 6 communities reasonably. */

    // Create the scale from the widths using a D3 scale (full width case)
    const band_scale = scaleBand()
      .domain(communities)
      .range([0, width])
      .padding(0.1);
    const band_width = band_scale.bandwidth();

    return Math.min(height-10, band_width);


  }

  create_cloud_data(community) {
    /* Extracts the top 20 keywords for each topic community */
    // Conditionally set the view, based on absolute (count) or relative (rank)
    let view_attr = (this.state.view === 'absolute') ? 'docs' : 'docs';

    // Select top 20 and format
    let top_20 = community.slice(0, 20).map(d => {
      return { text: d.word, value: d[view_attr] };
    });

    return top_20;
  }

  create_intercloud_scale() {
    /* Creates a size scale based on values from all community tokens. */

    // Conditionally set the view, based on absolute (count) or relative (rank)
    let absolute_scale = scaleSqrt().range([12, 36]);
    let relative_scale = scaleQuantile()
      .domain([1, 20])
      .range([12, 16, 20, 24, 36].reverse());
    
    if (this.state.data === {}) return null;
    else if (this.state.view === 'absolute') {
      // Concatentate the top 20 tokens for each community
      let top_20s = [].concat.apply([], entries(this.state.data)
        .map(d => this.create_cloud_data(d.value)))
        .map(d => d.value);

      absolute_scale.domain(extent(top_20s));
      //return absolute_scale;
      return relative_scale;
    } else {
      return relative_scale;
    }
  }

  create_cloud(community, key, scale) {
    let data = community.value;
    let this_community = community.key;

    // Conditionally create the cloud width. 
    // If our scale's bandwidth 

    return (<CommunityCloud
      key={key}
      width={this.state.scale}
      height={this.state.height}
      scale={scale}
      view={this.state.view}
      community={this_community}
      selected_community={this.state.community}
      data={data}
      onClick={this.props.onClickCloud}
    />);
  }

  render() {
    let intercloud = this.create_intercloud_scale();

    return (
      <Row style={center_styles}>{this.state.data && 
        entries(this.state.data)
          .filter(d => +d.key !== 5) // Filter out protests
          .map((d, i) => this.create_cloud(d, i, intercloud))
      }</Row>
    );
  }
}