/**
 * Helper functions used by more than one component.
 */
import { scaleOrdinal } from 'd3';

export const community_scale = scaleOrdinal()
  .domain([-1, 0, 1, 2, 3, 4, 5])
  .range(['#666666', '#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f']);


