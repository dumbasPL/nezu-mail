import React, { useEffect, useRef, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import throttle from 'lodash.throttle';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

export default function EmailHeader(props: {
  mailCount: number;
  connected: boolean;
  loading: boolean;
  onSearch: (q: string) => void;
}) {
  const [search, setSearch] = useState('');
  const handleSearch = useRef(throttle((value: string) => props.onSearch(value), 500));

  useEffect(() => handleSearch.current(search), [search]);

  return (
    <Row className="py-4 fs-4" xs="auto">
      <Col >
        <strong>{props.mailCount}</strong> emails
      </Col>
      <Col lg={4} xs={12}>
        <FormControl 
          type="search"
          placeholder="Search"
          onInput={(e: React.BaseSyntheticEvent) => setSearch(e.target.value)}
        />
      </Col>
      <Col xs="auto">
        {props.connected ? <Badge pill bg="success">Live</Badge> : <Badge pill bg="danger">Disconnected</Badge>}
      </Col>
      <Col xs="auto">
        {props.loading && <Spinner animation="grow" variant="primary" size="sm" />}
      </Col>
    </Row>
  );
}