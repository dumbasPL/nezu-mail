import axios from "axios";
import { Component, createRef, FormEvent } from "react";
import { Action, getActionNames, getActionOptions, getClassFromAny } from "./model/Action";
import { Container, Table, Button, Row, Col, Modal, Form, FormControl } from 'react-bootstrap'
import ErrorMessage from "./components/ErrorMessage";

interface IState {
  actions: Action[];
  type: string;
  error?: string;
  showAddModal: boolean;
  showDetailsModal: boolean;
  curAction: Action | null
}

export default class Actions extends Component<unknown, IState> {

  private actionForm = createRef<HTMLFormElement>();

  constructor(props: unknown) {
    super(props)
  
    this.state = {
      actions: [],
      type: getActionNames()[0],
      showAddModal: false,
      showDetailsModal: false,
      curAction: null
    }
  }

  refresh() {
    axios.get('/api/action').then(res => {
      this.setState({
        error: undefined,
        actions: res.data.map((x: any) => getClassFromAny(x)),
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message + ' - ' + (e.response ? e.response.data : '' ),
        actions: [],
      });
    });
  }

  componentDidMount = this.refresh;

  deleteAction(id: number) {
    axios.delete(`/api/action/${id}`).then(res => {
      this.setState({
        actions: this.state.actions.filter(a => a.id !== id)
      });
    }).catch(e => {
      console.log(e);
      this.setState({
        error: e.message + ' - ' + (e.response ? e.response.data : '' )
      })
    })
  }

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (this.actionForm.current && this.actionForm.current.checkValidity()) {
      const formData = new FormData(this.actionForm.current);
      const formDataObj = Object.fromEntries(formData.entries());

      axios.post('/api/action', formDataObj).then(res => {
        this.refresh();
      }).catch(e => {
        console.log(e);
        this.setState({
          error: e.message + ' - ' + (e.response ? e.response.data : '' )
        })
      })
      this.closeAddModal();
    } else {
      this.actionForm.current?.reportValidity();
    }
  }

  handleChangeType = (event: FormEvent<HTMLSelectElement>) => {
    let x = event.target as HTMLSelectElement;
    if (x) {
      this.setState({
        type: x.value
      });
    }
  }

  openAddModal = () => {
    this.setState({
      showAddModal: true,
      type: getActionNames()[0],
    });
  }

  closeAddModal = () => {
    this.setState({
      showAddModal: false
    });
  }

  openDetailsModal = (action: Action) => {
    this.setState({
      curAction: action,
      showDetailsModal: true,
    });
  }

  closeDetailsModal = () => {
    this.setState({
      curAction: null,
      showDetailsModal: false
    });
  }

  setActive = (action: Action, newState: boolean) => {
    const oldState = action.active;
    this.setState({
      actions: this.state.actions.map(a => {if (a.id === action.id) { a.active = newState; } return a;})
    });
    axios.post('/api/action/' + action.id, {
      active: newState
    }).catch(e => {
      console.log(e);
      this.setState({
        actions: this.state.actions.map(a => {if (a.id === action.id) { a.active = oldState; } return a;})
      });
    });
  }

  getCondition = (name: string, value?: string) => value ? <>{name}: <strong>{value}</strong><br/></> : null

  render() {
    let i = 0;
    return (
      <>
        <Container>
          <ErrorMessage message={this.state.error} />
          <Row className="justify-content-between my-4">
            <Col xs="auto">
              <h4>Actions</h4>
            </Col>
            <Col xs="auto">
              <Button variant="success" onClick={this.openAddModal}>New action</Button>
            </Col>
          </Row>
          <Table className="actions-table">
            <thead>
              <tr>
                <th style={{width: '1px'}}>active</th>
                <th>name</th>
                <th>type</th>
                <th>condition(s)</th>
                <th>priority</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.actions?.map(action => {
                return (
                  <tr key={i++}>
                    <td>
                      <Form.Check type="checkbox" checked={action.active} onChange={(e) => this.setActive(action, e.target.checked)}/>
                    </td>
                    <td>{action.name}</td>
                    <td>{action.className}</td>
                    <td>
                      {this.getCondition('Inbox', action.inbox)}
                      {this.getCondition('Sender', action.sender)}
                      {this.getCondition('Subject', action.subject)}
                      {action.sender == null && action.inbox == null && action.subject == null ? <strong>*</strong> : null}
                    </td>
                    <td>{action.priority}</td>
                    <td>
                      <Button size="sm" variant="primary" onClick={() => this.openDetailsModal(action)}>Show</Button>
                      <Button size="sm" variant="danger" onClick={() => this.deleteAction(action.id)} className="ms-1">Delete</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
        <Modal show={this.state.showDetailsModal} onHide={this.closeDetailsModal}>
          <Modal.Header closeButton>{this.state.curAction?.name}</Modal.Header>
          <Modal.Body style={{overflowWrap: 'break-word'}}>
            <p>Inbox regex: <strong>{this.state.curAction?.inbox ?? '*'}</strong></p>
            <p>Sender regex: <strong>{this.state.curAction?.sender ?? '*'}</strong></p>
            <p>Subject regex: <strong>{this.state.curAction?.subject ?? '*'}</strong></p>
            <p>Action priority: <strong>{this.state.curAction?.priority}</strong></p>
            <p>Action type: <strong>{this.state.curAction?.className}</strong></p>
            {getActionOptions(this.state.curAction ?? '')}
            <p>Last error: <strong>{this.state.curAction?.lastError ?? '-'}</strong></p>
          </Modal.Body>
        </Modal>
        <Modal show={this.state.showAddModal} onHide={this.closeAddModal}>
          <Form ref={this.actionForm} onSubmit={this.handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add new action</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <FormControl required type="text" name="name"/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Sender regex</Form.Label>
                <FormControl type="text" name="sender"/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Inbox regex</Form.Label>
                <FormControl type="text" name="inbox"/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Subject regex</Form.Label>
                <FormControl type="text" name="subject"/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Action priority</Form.Label>
                <FormControl required type="number" name="priority" min="1" max="10000" step="1" defaultValue="100"/>
              </Form.Group>
              <Form.Group>
                <Form.Label>Action type</Form.Label>
                <Form.Select name="className" onChange={this.handleChangeType}>
                  {getActionNames().map(name => <option value={name} key={name}>{name}</option>)}
                </Form.Select>
              </Form.Group>
              {getActionOptions(this.state.type)}
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
    );
  }

}

