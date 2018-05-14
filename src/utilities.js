/* 
  Utilities for our chart.
*/
import _ from 'lodash';
import * as d3 from 'd3';

// Globals
export const topic_columns = _.range(35);




/* Format a state's weekly counts. */
const callbackCount = (d) => {
  return {
    statefp: d.statefp,
    state: d.state,
    period: +d.period,
    count: +d.count
  };
}

/* Format a state's average topic vector. */
const callbackTopicVector = (d) => {
  // Map each topic probability to a float
  topic_columns.forEach(t => { d[t] = +d[t]; });
  // And convert the cluster too.
  d.cluster = +d.cluster;

  return d;
}



/* Interaction callbacks */
export const clickTreeTile = (e) => {
  console.log(e, e.target);
  const classes = d3.select(e.target)
    .attr('class')
    .split(' ');

  const click_topic = +classes[0];
  const click_state = classes[1].slice(3);

  return {
    topic: click_topic,
    statefp: click_state
  };
  //console.log(classes, click_state, click_topic);
}

export const clickCountTile = (e) => {
  const classes = d3.select(e.target)
    .attr('class')
    .split(' ');

  const click_period = +classes[1];
  const click_state = classes[2];

  return {
    period: click_period,
    statefp: click_state
  };
}


/* Create a heirarchy of a state's top N topics, formatted for D3 layouts. */
export const getStateHeirarchy = (state, n) => {
  // Create an array of each state's topic prob objects
  let state_topic_probs = topic_columns.map(topic_col  => {
      return {
        name: topic_col, 
        prob: state[topic_col],
        parent: 'st-' + state.statefp
      };
    })
    // Sort them on probabilities
    .sort((a, b) => {
      if (a.prob < b.prob) return -1;
      if (a.prob > b.prob) return 1;
      return 0;
    })
    // Tale the n most probable as our heirarchy children
    .slice(0, n);

  // Add the state to the children for our layout
  state_topic_probs.push({
    name: 'st-' + state.statefp, 
    parent: ''
  });

  return {
    data: {
      name: state.abbrv,
      statefp: state.statefp,
      cluster: state.cluster
    },
    children: state_topic_probs,
    parentId: "",
    statefp: state.statefp
  };
};

/* Convert an array of objects to an object containing objects, 
  indexed by a given key.
*/
export const arrayToObject = (arr, prop) =>
  arr.reduce((obj, item) => {
    obj[item[prop]] = item
    return obj
  }, {})[0];


export const loadData = (callback = _.noop) => {
  let countsByState, topicVectorsByState;

  // Load all the data synchronously. AKA get all of them back at once.
  d3.queue()
    .defer(d3.csv, 'data/state-weekly-count.csv', callbackCount)
    .defer(d3.csv, 'data/avg-state-vectors.csv', callbackTopicVector)
    //.defer(d3.json, 'county.topo.json')
    .awaitAll((err, data) => {
      if (err) throw err;

      /* Do any data manipulations before passing to the app */

      // Format the state weekly counts, 'groupby' state fips
      countsByState = d3.nest()
        .key((d) => { return d.statefp; })
        .entries(data[0]);
      
      // Create map for faster lookup when interacting
      topicVectorsByState = d3.map(data[1], (d) => { return d.statefp; });
      
      // Precompute top 5 vectors heirarchy for treemap
      let top_topic_vectors = topicVectorsByState.values()
        .map(stateVec => getStateHeirarchy(stateVec, 5));

      
      //console.log(data[0], data[1], countsByState, topicVectorsByState);

      // Assign them to our app by using the callback function provided to us
      callback({
        counts: countsByState,
        topicVectors: topicVectorsByState,
        topTopicVectors: top_topic_vectors
      });
    });
};
