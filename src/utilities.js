/**
 * Helper functions used by more than one component.
 */
import { scaleOrdinal, scaleLinear } from 'd3';

/* Community Globals */
export const communities =  [-1, 0, 1, 2, 3, 4];
export const community_scale = scaleOrdinal()
  .domain(communities)
  .range(['#bdbdbd', '#7fc97f','#ffff99','#fdc086', '#beaed4', '#ef3b2c']);
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




/* Styles */
export const center_styles = {
  'alignItems': 'center',
  'justifyContent': 'center',
  'margin': '3px'
};

/* Weeks */
export const weeks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];


//export const aspect_ratio = (width, height) => {}