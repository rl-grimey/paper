/**
 * Helper functions used by more than one component.
 */
import { scaleOrdinal, scaleLinear } from 'd3';

/* Community Globals */
export const communities =  [-1, 0, 1, 2, 3, 4, 5];
export const community_scale = scaleOrdinal()
  .domain([-1, 0, 1, 2, 3, 4, 5])
  .range(['#666666', '#7fc97f','#beaed4','#fdc086','#ffff99','#386cb0','#f0027f']);
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
