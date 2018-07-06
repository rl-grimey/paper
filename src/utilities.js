/**
 * Helper functions used by more than one component.
 */
import { scaleOrdinal } from 'd3';

/* Community Globals */
export const communities =  [-1, 0, 1, 2, 3, 4];
export const community_scale = scaleOrdinal()
  .domain(communities)
  .range(['#bdbdbd', '#7fc97f','#ffff99','#fdc086', '#beaed4', '#fb6a4a']);
export const community_labels = scaleOrdinal()
  .domain(communities)
  .range([
    'Other',
    'Muslim Immigrants',
    'Islam and Religion',
    "Trump's Order",
    'Refugee Crises',
    'Immigration Policies'
  ]);




/* Styles */
export const center_styles = {
  'alignItems': 'center',
  'justifyContent': 'center',
  'margin': '3px'
};
export const margin_grid = {top: 0, right: 0, bottom: 0, left: 0};
export const margin_modal = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 50
};

/* Weeks */
export const weeks = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
export const week_labels = scaleOrdinal()
  .domain(weeks)
  .range([
    'Dec 30th, 2016',
    'Jan 6th, 2017',
    'Jan 13th',
    'Jan 20th',
    'Jan 27th\nTravel Ban',
    'Feb 3rd',
    'Feb 10th',
    'Feb 17th',
    'Feb 24th'
  ]);


//export const aspect_ratio = (width, height) => {}