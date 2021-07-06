import axios from 'axios'
import React, { Component, createRef, FormEvent } from 'react'
import { Container, Table, Button, Row, Col, Modal, FormControl, Form } from 'react-bootstrap'
import ErrorMessage from './components/ErrorMessage';


interface IState {
  domains: string[];
  error?: string;
  showAddModal: boolean;
}

export default class Domains extends Component<unknown, IState> {

  private domainRef = createRef<HTMLInputElement>();
  private domainForm = createRef<HTMLFormElement>();

  constructor(props: unknown) {
    super(props)
  
    this.state = {
      domains: [],
      showAddModal: false
    }
  }

  refresh() {
    axios.get('/api/domain').then(res => {
      this.setState({
        error: undefined,
        domains: res.data,
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message + ' - ' + (e.response ? e.response.data : '' ),
        domains: [],
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
    if (this.domainRef.current && this.domainForm.current) {
      if (this.domainForm.current.checkValidity()) {
        const value = this.domainRef.current.value.trim();
        axios.post('/api/domain', {
          domain: value
        }).then(res => {
          this.setState({
            domains: [value, ...this.state.domains]
          });
        }).catch(e => {
          console.log(e);
          this.setState({
            error: e.message + ' - ' + (e.response ? e.response.data : '' )
          })
        })
        this.closeAddModal();
      } else {
        this.domainForm.current.reportValidity();
      }
    }
  }

  deleteDomain(domain: string) {
    axios.delete(`/api/domain/${domain}`).then(res => {
      this.setState({
        domains: this.state.domains.filter(d => d !== domain)
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
              <h4>Domains</h4>
            </Col>
            <Col xs="auto">
              <Button variant="success" onClick={this.openAddModal}>New domain</Button>
            </Col>
          </Row>
          <Table className="domains-table">
            <thead>
              <tr>
                <th>domain</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.domains?.map(domain => {
                return (
                  <tr key={i++}>
                    <td>{domain}</td>
                    <td>
                      <Button variant="danger" onClick={() => this.deleteDomain(domain)}>Delete</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
        <Modal show={this.state.showAddModal} onHide={this.closeAddModal}>
          <Form ref={this.domainForm} onSubmit={this.handleModalSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add new domain</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Domain</Form.Label>
                <FormControl required type="text" ref={this.domainRef}/>
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
