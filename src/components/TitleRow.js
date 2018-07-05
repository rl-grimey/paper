import React from 'react';
import { Row, Col } from 'react-bootstrap';
import HelpButton from './widgets/HelpButton';
import SettingsButton from './widgets/SettingsButton';

export default class TitleRow extends React.Component {
  render() {
    return (
      <Row>
        <Col xs={11}>
          <h3 className="dashboard-title">
            <abbr 
              title="Cartographic Topic Visualization of Immigrant-related Tweets *before* and *after* the Travel Ban."
            >CarTopicVis
            </abbr>
          </h3>
        </Col>
        <Col xs={1}>
          <Row>
            <HelpButton/>
            <SettingsButton/>
          </Row>
        </Col>
      </Row>
    );
  }
}