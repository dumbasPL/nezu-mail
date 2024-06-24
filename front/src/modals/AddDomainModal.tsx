import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addDomain } from '../api/domain';
import ErrorMessage from '../components/ErrorMessage';

export default function AddDomainModal(props: {
  show: boolean;
  onClose: () => void;
}) {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (props.show) {
      setDomain('');
    }
  }, [props.show]);
  
  const mutation = useMutation({
    mutationFn: addDomain,
    onSuccess: () => {
      props.onClose();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate(domain);
  }

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add new domain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {mutation.error && <ErrorMessage message={mutation.error.toString()} />}
          <Form.Group>
            <Form.Label>Domain</Form.Label>
            <FormControl 
              required
              type="text"
              name="domain"
              value={domain}
              onChange={e => setDomain(e.target.value)}
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