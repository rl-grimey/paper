/* Dependencies */
import React from 'react';
import { Row } from 'react-bootstrap';
import { scaleBand } from '@vx/scale';
import { entries } from 'd3';
import CommunityCloud from './tiles/CommunityCloud';
import { communities, center_styles } from '../utilities';

export default class CommunityGrid extends React.Component {
  constructor(props) {
    super();

    this.state = {
      width      : props.width,
      height     : props.height,
      scale      : this.create_clouds_scale(props.width),
      community  : props.community,
      communities: communities,
      view       : props.view,
      data       : {}
    }

    this.create_clouds_scale = this.create_clouds_scale.bind(this);
    this.create_cloud = this.create_cloud.bind(this);
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
        (nextProps.community !== this.state.community)) return true;
    else return false;
  }

  componentWillReceiveProps(nextProps) {
    /* Update the community, view, and dimensions */
    let scale = this.create_clouds_scale(nextProps.width);
    this.setState({ ...nextProps, scale });
  }

  create_clouds_scale(width) {
    /* Creates a scale to fit our 6 communities reasonably. */
    return scaleBand({
      domain: communities,
      range: [0, width],
      padding: 0.1
    });
  }

  create_cloud(community, i) {
    let data = community.value;
    let this_community = community.key;

    return (<CommunityCloud
      key={i}
      width={this.state.scale.bandwidth()}
      height={this.state.height}
      view={this.state.view}
      community={this_community}
      selected_community={this.state.community}
      data={data}
      onClick={this.props.onClickCloud}
    />);
  }

  render() {
    return (
      <Row style={center_styles}>{this.state.data && 
        entries(this.state.data)
          .filter(d => +d.key !== 5) // Filter out protests
          .map((d, i) => this.create_cloud(d, i))
      }</Row>
    );
  }
}