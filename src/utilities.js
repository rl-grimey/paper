/**
 * Helper functions used by more than one component.
 */
import { scaleOrdinal, scaleLinear } from 'd3';

/* Community Globals */
export const communities =  [-1, 0, 1, 2, 3, 4];
export const community_scale = scaleOrdinal()
  .domain(communities)
  .range(['#666666', '#7fc97f','#ffff99','#fdc086', '#beaed4','#386cb0']);


export const community_labels = scaleOrdinal()
  .domain(communities)
  .range([
    'Unclassified',
    'Religions',
    '???',
    "Trump's Executive Order",
    'Refugee Crisis',
    'Immigration Policies',
    'Protests'
  ]);

export const center_styles = {
  'alignItems': 'center',
  'justifyContent': 'center'
};
