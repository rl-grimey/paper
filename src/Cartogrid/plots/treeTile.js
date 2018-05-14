import React from 'react';
import { Group } from '@vx/group';
import { Treemap } from '@vx/hierarchy';
import { hierarchy, stratify, treemap } from 'd3-hierarchy';
import { 
  treemapSquarify, 
  treemapBinary,
  treemapSlice,
  treemapSliceDice,
} from 'd3-hierarchy';
import { scaleLinear } from '@vx/scale';
import { interpolateRgb } from 'd3-interpolate';
import { Text } from '@vx/text';
import { withTooltip, TooltipWithBounds } from '@vx/tooltip';
import { localPoint } from '@vx/event';

export default class TreeTile extends React.Component {
  handleMouseOver = (event, datum) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    console.log(coords);
  }

  render() {
    // Create heirarchy from state topics passed in
    const nodes = stratify()
      .id(d => d.name)
      .parentId(d => d.parent)
      (this.props.data.children);

    const layout = hierarchy(nodes)
      .sum(d => d.data.prob)
      .sort((a, b) => b.value - a.value);

    const testTree = treemap()
      .tile(treemapBinary)
      .size(this.props.size)
      .round(false)
      .padding(1);

    const testTreeLayout = testTree(layout);

    let colorScale = this.props.colorScale;

    return (
      <Group top={this.props.top} left={this.props.left}>
        {testTreeLayout.descendants()
          .filter(d => d.data.data.hasOwnProperty('name'))
          .map((node, i) => (
          <rect 
            id={`rect-st-${node.data.id}-topic-${node.data.id}`}
            key={i + `rect-st-${node.data.id}-topic-${node.data.id}`}
            className={node.data.id + ' ' + node.data.data.parent}
            x={node.x0}
            y={node.y0}
            width={(node.x1 - node.x0) * 1}
            height={(node.y1 - node.y0) * 1}
            fill={node.depth === 0 ? 'transparent' : colorScale(node.data.id)}
            //stroke={node.depth === 0 ? null : '#333333'}
            //strokeWidth={node.depth === 0 ? 0 : 1}
            onClick={this.props.clickCallback}
          />
        ))}
      </Group>
    );
  }
}

/*
onMouseMove={() => e => this.handleMouseOverBar(e, node)}
onMouseOut={() => hideTooltip}
const TreeTile = withTooltip(TreeTileSans);
export default TreeTile;
*/