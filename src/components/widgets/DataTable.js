import React from 'react';
import { Table } from 'react-bootstrap';
import { community_labels, community_scale, sentiment_scale } from '../../utilities';
import { color } from 'd3';


class DataRow extends React.PureComponent {
  render() {
    /* Renders a row in our tweet table. */
    let { tweet } = this.props;

    // Sentiment coloring
    let parsed = Number.parseFloat(tweet.polarity).toPrecision(2);
    let sent_background = sentiment_scale(parsed);
    
    // Topic Coloring
    let topic_background = community_scale(tweet.Topic);

    return (
      <tr>
        <td>{tweet.week}</td>
        <td>{tweet.message}</td>
        <td bgcolor={sent_background}>{parsed}</td>
        <td bgcolor={topic_background}>{tweet.Topic}</td>
      </tr>
    );
  }
}


export default class DataTable extends React.Component {
  constructor(props) {
    super();
    let sorted = props.tweets.slice().sort((a, b) => a.polarity < b.polarity);

    this.state = {
      tweets: sorted
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    return (
      <Table 
        striped 
        condensed 
        hover
      >
        <thead>
          <tr>
            <th>Week</th>
            <th>Message</th>
            <th>Sentiment</th>
            <th>Topic</th>
            {/*<th>P(<i>{community_labels(0)})</i></th>
            <th>P(<i>{community_labels(1)})</i></th>
            <th>P(<i>{community_labels(2)})</i></th>
            <th>P(<i>{community_labels(3)})</i></th>
            <th>P(<i>{community_labels(4)})</i></th>
            <th>P(<i>{community_labels(-1)})</i></th>*/}
          </tr>
        </thead>
        <tbody>
          {this.state.tweets.map((d, i) => <DataRow tweet={d} key={i} />)}
        </tbody>
      </Table>
    );
  }
}