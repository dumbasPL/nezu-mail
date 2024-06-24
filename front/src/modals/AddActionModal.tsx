import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { useMutation } from '@tanstack/react-query';
import { ActionForm, ACTION_NAMES, addAction } from '../api/action';
import ErrorMessage from '../components/ErrorMessage';
import { useEffect, useState } from 'react';
// import { getActionNames, getActionOptions } from '../actions';

const defaultState = Object.freeze({
  className: 'DeleteAction',
  name: '',
  sender: '',
  inbox: '',
  subject: '',
  priority: 100,
  active: true,
  regex: '',
  replacement: '',
  webhookUrl: '',
});

export default function AddActionModal(props: {
  show: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState(defaultState);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (props.show) {
      setFormData(defaultState);
      setValidated(false);
    }
  }, [props.show]);

  const mutation = useMutation({
    mutationFn: addAction,
    onSuccess: () => {
      props.onClose();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity() === false) {
      setValidated(true);
      return;
    }
    mutation.mutate(formData as ActionForm);
  }

  const handleChange = (name: string, value: string | number | boolean) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event.target.name, event.target.value);
  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event.target.name, parseInt(event.target.value));
  // const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => handleChange(event.target.name, event.target.checked);
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => handleChange(event.target.name, event.target.value);

  const getActionOptions = (type: string) => {
    switch (type) {
      case 'DeleteAction':
        return null;
      case 'DiscordWebhookAction':
      case 'WebhookAction':
        return (
          <Form.Group>
            <Form.Label>Webhook URL</Form.Label>
            <FormControl required type="text" name="webhookUrl" value={formData.webhookUrl} onChange={handleTextChange}/>
          </Form.Group>
        );
      case 'ReplaceAction':
        return (
          <>
            <Form.Group>
              <Form.Label>Regex</Form.Label>
              <FormControl required type="text" name="regex" value={formData.regex} onChange={handleTextChange}/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Replacement</Form.Label>
              <FormControl required type="text" name="replacement" value={formData.replacement} onChange={handleTextChange}/>
            </Form.Group>
          </>
        );
      default:
        return <ErrorMessage message="Unknown action type" />;
    }
  }

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Form validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add new action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mutation.error && <ErrorMessage message={mutation.error.toString()} />}
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <FormControl required type="text" name="name" value={formData.name} onChange={handleTextChange} autoFocus/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Sender regex</Form.Label>
            <FormControl type="text" name="sender" value={formData.sender} onChange={handleTextChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Inbox regex</Form.Label>
            <FormControl type="text" name="inbox" value={formData.inbox} onChange={handleTextChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Subject regex</Form.Label>
            <FormControl type="text" name="subject" value={formData.subject} onChange={handleTextChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Action priority</Form.Label>
            <FormControl 
              required
              type="number"
              min="1"
              max="10000"
              step="1"
              defaultValue="100"
              name="priority"
              value={formData.priority}
              onChange={handleNumberChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Action type</Form.Label>
            <Form.Select name="className" onChange={handleSelectChange}>
              {ACTION_NAMES.map(name => <option value={name} key={name}>{name}</option>)}
            </Form.Select>
          </Form.Group>
          {getActionOptions(formData.className)}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}