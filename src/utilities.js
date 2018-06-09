/* 
  Utilities for our chart.
*/
import _ from 'lodash';
import * as d3 from 'd3';
import states from './states';

// Globals
export const topic_columns = _.range(35);




/* Format a state's weekly counts. */
const callbackCount = (d) => {
  return {
    statefp: d.statefp,
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
  if (d.hasOwnProperty('macro_period')) d.macro_period = +d.macro_period;
  return d;
}

const callbackTopicTokens = (d) => {
  // Convert rank to *1-indexed* integer
  d.rank = +d.rank;
  d.topic = +d.topic;
  d.value = +d.count;
  d.text = d.token;
  return d;
}

const callbackClusterTokens = (d) => {
  d.cluster = +d.cluster;
  d.value = +d.value;
  return d;
}

const callbackLong = (d) => {
  d.macro_period = +d.macro_period;
  d.topic = +d.topic;
  d.prob = -(+d.prob);
  if (d.macro_period === -1) d.prob = -(d.prob);  
  return d;
}

const callbackTweets = (d) => {
  // message,statefp,macro_period,polarity,cluster
  d.polarity = +d.polarity;
  d.macro_period = +d.macro_period;
  d.cluster = +d.cluster;
  return d;
}



/* Interaction callbacks */
export const clickCountTile = (e) => {
  const classes = d3.select(e.target)
    .attr('class')
    .split(' ');

  const click_period = +classes[0];
  const click_state = classes[1];

  return {
    period: click_period,
    statefp: click_state
  };
}

export const clickClusterTile = (e) => {
  const classes = d3.select(e.target)
    .attr('class').split(' ');
  const click_cluster = +classes[0];

  return {
    cluster: click_cluster,
    statefp: classes[1]
  }
}

export const clickSentTile = (e) => {
  const classes = d3.select(e.target)
    .attr('class').split(' ');
  return { statefp: classes[0]};
}

export const clickClusterCloud = (cluster) => {
  return {cluster: cluster};
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


const getTopTopics = (state, n) => {
  // Create an array of each state's topic prob objects
  let state_topic_probs = topic_columns.map(topic_col  => {
    return {
      topic: topic_col, 
      prob: state[topic_col],
      period: state.macro_period
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

  return state_topic_probs;
}

export const getStateTimeHeirarchy = (state, n) => {
  let state_before = [], 
      state_after  = [];

  // Get top topics, IF the period exists
  if (state.hasOwnProperty(-1)) state_before = getTopTopics(state[-1][0], n);
  if (state.hasOwnProperty(1)) state_after  = getTopTopics(state[1][0],  n);
  
  return {
    before: state_before,
    after: state_after
  };
}

export const getStateTimeCluster = (state) => {
  let state_before, state_after;

  if (state.hasOwnProperty(-1)) state_before = state[-1][0].cluster;
  if (state.hasOwnProperty(1)) state_after = state[1][0].cluster;

  return {
    before: state_before,
    after: state_after
  };
}

export const getRandomSubarray = (arr, size) => {
  var shuffled = arr.slice(0), i = arr.length, min = i - size, temp, index;
  while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}


export const loadData = (callback = _.noop) => {
  let files = [
    'data/state-weekly-count.csv',
    'data/avg-state-vectors.csv',
    'data/avg-state-vectors-time.csv',
    'data/topic-word-ranks.csv',
    'data/cluster-token-counts.csv',
    'data/avg-state-vector-long.csv',
    'data/datatable.csv',
    'data/state-sent-dists.json'
  ];

  let countsByState, 
      topicVectorsByState, 
      topicVectorsByTime,
      topicVectorsLong,
      counties,
      topicTokens,
      clusterTokens,
      stateSents;

  // Load all the data synchronously. AKA get all of them back at once.
  //Promise.all(files.map(f => d3.csv(f)))
  Promise.all(files.map(f => {
      return files.indexOf(f) !== files.length-1 ? d3.csv(f) : d3.json(f);
    }))
    .then(data => {
      /* Do any data manipulations before passing to the app */
      data[0] = data[0].map(d => callbackCount(d));
      data[1] = data[1].map(d => callbackTopicVector(d));
      data[2] = data[2].map(d => callbackTopicVector(d));
      data[3] = data[3].map(d => callbackTopicTokens(d));
      data[4] = data[4].map(d => callbackClusterTokens(d));
      data[5] = data[5].map(d => callbackLong(d));
      data[6] = data[6].map(d => callbackTweets(d));

      // Format the state weekly counts, 'groupby' state fips
      countsByState = d3.nest()
        .key((d) => { return d.statefp; })
        .entries(data[0]);
      
      // Get the max so we can scale across states
      /* Normalizing globally drastically changes the visible portion.
      let maxCount = d3.max(
        data[0].filter(d => d.statefp !== '11'), 
        d => { return d.count / states[d.statefp].pop17; }
      );*/
      let maxCount = d3.max(data[0], d => d.count);
      
      // Create map for faster lookup when interacting
      topicVectorsByState = d3.map(data[1], (d) => { return d.statefp; });

      topicVectorsByTime = d3.nest()
        .key(d => d.statefp)
        .key(d => d.macro_period)
        .object(data[2]);
      
      topicTokens = d3.nest().key(d => d.topic).entries(data[3]);
      clusterTokens = d3.nest().key(d => d.cluster).entries(data[4]);

      topicVectorsLong = d3.nest()
        .key(d => d.statefp)
        .key(d => d.topic)
        .object(data[5].filter(d => d.macro_period !== 0));


      // Assign them to our app by using the callback function provided to us
      callback({
        counts: countsByState,
        maxCount: maxCount,
        topicTimeVectors: topicVectorsByTime,
        clusterTokens: clusterTokens,
        stateSents: data[7],
        tweets: data[6]
      });
    });
};
