import axios from 'axios'
import React, { Component, createRef, FormEvent } from 'react'
import { Container, Table, Button, Row, Col, Modal, FormControl, Form } from 'react-bootstrap'
import ErrorMessage from './components/ErrorMessage';


interface Token {
  name: string;
  token: string;
}

interface IState {
  tokens: Token[];
  error?: string;
  showAddModal: boolean;
}

export default class Tokens extends Component<unknown, IState> {

  private tokenNameRef = createRef<HTMLInputElement>();
  private tokenFrom = createRef<HTMLFormElement>();

  constructor(props: unknown) {
    super(props)
  
    this.state = {
      tokens: [],
      showAddModal: false
    }
  }

  refresh() {
    axios.get('/api/token').then(res => {
      this.setState({
        error: undefined,
        tokens: res.data,
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message + ' - ' + (e.response ? e.response.data : '' ),
        tokens: [],
      });
    });
  }

  componentDidMount = this.refresh;

  openAddModal = () => {
    this.setState({
      showAddModal: true
    });
  }

  closeAddModal = () => {
    this.setState({
      showAddModal: false
    });
  }

  handleModalSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.tokenNameRef.current && this.tokenFrom.current) {
      if (this.tokenFrom.current.checkValidity()) {
        const value = this.tokenNameRef.current.value.trim();
        axios.post('/api/token', {
          name: value
        }).then(res => {
          this.setState({
            tokens: [res.data, ...this.state.tokens]
          });
        }).catch(e => {
          console.log(e);
          this.setState({
            error: e.message + ' - ' + (e.response ? e.response.data : '' )
          })
        })
        this.closeAddModal();
      } else {
        this.tokenFrom.current.reportValidity();
      }
    }
  }

  deleteToken(token: string) {
    axios.delete(`/api/token/${token}`).then(res => {
      this.setState({
        tokens: this.state.tokens.filter(t => t.token !== token)
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message + ' - ' + (e.response ? e.response.data : '' )
      })
    })
  }

  render() {
    let i = 0;
    return (
      <>
        <Container>
          <ErrorMessage message={this.state.error} />
          <Row className="justify-content-between my-4">
            <Col xs="auto">
              <h4>API Tokens</h4>
            </Col>
            <Col xs="auto">
              <Button variant="success" onClick={this.openAddModal}>New token</Button>
            </Col>
          </Row>
          <Table className="tokens-table">
            <thead>
              <tr>
                <th>name</th>
                <th>token</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tokens?.map(token => {
                return (
                  <tr key={i++}>
                    <td>{token.name}</td>
                    <td>{token.token}</td>
                    <td>
                      <Button variant="danger" onClick={() => this.deleteToken(token.token)}>Delete</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
        <Modal show={this.state.showAddModal} onHide={this.closeAddModal}>
          <Form ref={this.tokenFrom} onSubmit={this.handleModalSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add new token</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Token name</Form.Label>
                <FormControl required type="text" ref={this.tokenNameRef}/>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.closeAddModal}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    )
  }
}
