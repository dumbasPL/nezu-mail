import axios, { CancelTokenSource } from 'axios'
import React, { Component } from 'react'
import EmailHeader from './components/EmailHeader';
import ErrorMessage from './components/ErrorMessage';
import Pagination from './components/Pagination';
import { Table, Container, Row, Col } from 'react-bootstrap'
import { Link, RouteComponentProps } from 'react-router-dom'
import moment from 'moment';

export interface IMail {
  id: number;
  sender: string;
  inbox: string;
  subject: string;
  date: string;
  body?: string;
}

interface IState {
  offset: number;
  query?: string;
  count?: number;
  error?: string;
  emails: IMail[];
}

export default class Mails extends Component<RouteComponentProps, IState> {

  private cancelSource?: CancelTokenSource;

  constructor(props: any) {
    super(props)

    this.state = {
      offset: 0,
      emails: []
    };
  }

  sendRequest() {
    
    this.cancelSource?.cancel();

    this.cancelSource = axios.CancelToken.source()

    const searchParams = new URLSearchParams(this.props.location.search);
    const sender = searchParams.get('sender');
    const inbox = searchParams.get('inbox');

    axios.get('/api/mail', {
      params: {
        skip: this.state.offset,
        search: this.state.query,
        sender: sender,
        inbox: inbox
      },
      cancelToken: this.cancelSource.token
    }).then(res => {
      const data = res.data;
      this.setState({
        count: data.total,
        emails: data.data,
        error: undefined
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message + ' - ' + (e.response ? e.response.data : '' ),
        emails: [],
        offset: 0,
        count: 0
      });
    })
  }

  componentDidMount() {
    this.sendRequest();
  }

  componentWillUnmount() {
    this.cancelSource?.cancel();
  }

  goToPage(n: number) {
    this.setState({
      offset: n
    });
    this.sendRequest();
  }
  
  search(q: string) {
    this.setState({
      offset: 0,
      query: q
    }, () => this.sendRequest());
  }

  render() {
    let i = 0;
    return (
      <Container>
        <ErrorMessage message={this.state.error} />
        <EmailHeader mailCount={this.state.count ?? 0} onSearch={(q) => this.search(q)} />
        <Table className="email-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Sender</th>
              <th>Inbox</th>
            </tr>
          </thead>
          <tbody>
            {this.state.emails.map(mail => {
              return (
                <tr key={i++}>
                  <td>{moment(mail.date).fromNow()}</td>
                  <td>
                  <Link to={`/mail/${mail.id}`}>
                    {mail.subject}
                  </Link>
                  </td>
                  <td>{mail.sender}</td>
                  <td>{mail.inbox}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Row className="justify-content-md-center">
          <Col xs="auto">
            <Pagination current={this.state.offset} perPage={25} total={this.state.count ?? 0} onClick={(n) => this.goToPage(n)}/>
          </Col>
        </Row>
      </Container>
    )
  }
}