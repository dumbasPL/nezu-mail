import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import ErrorMessage from '../components/ErrorMessage';
import { addToken } from '../api/token';

export default function AddTokenModal(props: {
  show: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (props.show) {
      setName('');
    }
  }, [props.show]);
  
  const mutation = useMutation({
    mutationFn: addToken,
    onSuccess: () => {
      props.onClose();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(name);
  }

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add new token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mutation.error && <ErrorMessage message={mutation.error.toString()} />}
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <FormControl 
              required
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={mutation.isPending}>
            Add
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}