import React from 'react';
import { Grid, Col, Row } from 'react-bootstrap';

export class Slider extends React.Component {
  render() {
    return (
      <fieldset>
        <span>
          <label htmlFor={this.props.name}>{this.props.label}</label>
          <span>&nbsp;</span>
          <input 
            type={"range"}
            name={this.props.name}
            min={this.props.min}
            max={this.props.max}
            value={this.props.value}
            step={this.props.step}
            onChange={this.props.onChange}
          />
        </span>
      </fieldset>
    );
  }
}

export class Toggle extends React.Component {
  render() {
    return (<div></div>);
  }
}

/*export class WidgetBar extends React.Component {
  render() {
    <Row>
    
    </Row>
  }
}
*/