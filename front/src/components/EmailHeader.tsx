import React, { Component } from 'react';
import { Row, Col, FormControl } from 'react-bootstrap';

interface IParams {
  mailCount: number;
  onSearch: (q: string) => void;
}

export default class EmailHeader extends Component<IParams> {
  render() {
    return (
      <Row className="py-4 fs-4" xs="auto">
        <Col >
          <strong>{this.props.mailCount}</strong> emails
        </Col>
        <Col lg={4} xs={12}>
          <FormControl 
            type="search"
            placeholder="Search"
            onInput={(e: React.BaseSyntheticEvent) => this.props.onSearch(e.target.value)}
          />
        </Col>
      </Row>
    );
  }
}
