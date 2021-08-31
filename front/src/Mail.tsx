import axios from 'axios'
import React, { Component } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { RouteComponentProps, Link, Redirect } from 'react-router-dom'
import ErrorMessage from './components/ErrorMessage';
import CustomIframe from './components/CustomIframe';
import { IMail } from './Mails'


interface RouteParams {
  id: string;
}

interface IState {
  mail?: IMail;
  error?: string;
  deleted: boolean;
}

export default class Mail extends Component<RouteComponentProps<RouteParams>, IState> {

  constructor(props: any) {
    super(props)
    this.state = {
      deleted: false
    }
  }

  componentDidMount() {
    axios.get(`/api/mail/${this.props.match.params.id}`, {
      headers: {
        accept: 'application/json'
      }
    }).then(res => {
      this.setState({ 
        mail: res.data,
        error: undefined
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.response ? e.response.data : e.message ?? e.toString(),
        mail: undefined
      });
    })
  }

  deleteMail = () => {
    axios.delete(`/api/mail/${this.props.match.params.id}`).then(res => {
      this.setState({
        deleted: true
      })
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.response ? e.response.data : e.message ?? e.toString(),
      });
    })
  }

  render() {
    if (this.state.deleted) {
      return (<Redirect to='/mails' />);
    }
    if (!this.state.mail) {
      return (
        <Container>
          <ErrorMessage message={this.state.error} />
        </Container>
      )
    }
    return (
      <Container>
        <ErrorMessage message={this.state.error} />
        <Row className="py-4 fs-4 justify-content-between" xs="auto">
          <Col>
            <strong>{this.state.mail.subject.trim().length === 0 ? '(No subject)' : this.state.mail.subject}</strong>
          </Col>
          <Col>
            <Button variant="danger" onClick={this.deleteMail}>Delete</Button>
          </Col>
        </Row>
        <Row className="pb-2" xs="auto">
          <Col>
            From <Link to={{pathname: '/mails', search: new URLSearchParams({sender: this.state.mail.sender}).toString()}} >
              {this.state.mail.sender}
            </Link> to <Link to={{pathname: '/mails', search: new URLSearchParams({inbox: this.state.mail.inbox}).toString()}} >
              {this.state.mail.inbox}
            </Link> 
          </Col>
        </Row>
        <Row className="py-2 mb-5" xs="auto">
          <Col xs="12" className="bg-white">
            <CustomIframe html={this.state.mail?.body ?? ''} title="email-body" />
          </Col>
        </Row>



      </Container>
    )
  }
}
