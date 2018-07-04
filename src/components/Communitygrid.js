/* Dependencies */
import React from 'react';
import { Row } from 'react-bootstrap';
import { scaleBand } from '@vx/scale';
import { values } from 'd3';
import CommunityCloud from './tiles/CommunityCloud';

export default class CommunityGrid extends React.Component {
  constructor(props) {
    super();

    this.state = {
      width      : props.width,
      height     : props.height,
      scale      : this.create_clouds_scale(props.width),
      community  : props.community,
      communities: [-1, 0, 1, 2, 3, 4, 5],
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
    if (nextProps.view !== this.state.view) return true;
    else if (nextProps.width !== this.state.width) return true;
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
      domain: [-1, 0, 1, 2, 3, 4 ,5],
      range: [0, width],
      padding: 0.1
    });
  }

  create_cloud(data, i) {
    return (<CommunityCloud
      key={i}
      width={this.state.scale.bandwidth()}
      height={this.state.height}
      view={this.state.view}
      community={this.state.community}
      data={data}
    />);
  }

  render() {
    return (
      <Row>{this.state.data && 
        values(this.state.data).map((d, i) => this.create_cloud(d, i))
      }</Row>
    );
  }
}