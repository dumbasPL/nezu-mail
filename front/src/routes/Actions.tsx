import { useState } from "react";
import ActionsDetailsModal from "../modals/ActionDetailsModal";
import AddActionModal from "../modals/AddActionModal";
import { Action, deleteAction, getActions, setActiveAction } from "../api/action";
import ErrorMessage from "../components/ErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";

export default function Actions() {
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { error, data: actions } = useQuery({
    queryKey: ['actions'],
    queryFn: getActions,
  });

  const deleteActionMutation = useMutation({
    mutationFn: deleteAction,
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['actions']});
    }
  });

  const setActiveMutation = useMutation({
    mutationFn: setActiveAction,
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['actions']});
    }
  });

  const handleAddModalClose = () => {
    setAddModalOpen(false);
    queryClient.invalidateQueries({queryKey: ['actions']});
  }

  return (
    <>
      {error && <ErrorMessage message={error.toString()} />}

      <Row className="justify-content-between my-4">
        <Col xs="auto">
          <h4>Actions</h4>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={() => setAddModalOpen(true)}>New action</Button>
        </Col>
      </Row>

      <Table>
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
          {actions?.map(action =>
            <tr key={action.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={action.active}
                  onChange={e => setActiveMutation.mutate({id: action.id, active: e.target.checked})}
                  disabled={setActiveMutation.isPending}
                />
              </td>
              <td>{action.name}</td>
              <td>{action.className}</td>
              <td>
                {action.inbox && <>{'Inbox: '}<strong>{action.inbox}</strong><br/></>}
                {action.sender && <>{'Sender: '}<strong>{action.sender}</strong><br/></>}
                {action.subject && <>{'Subject: '}<strong>{action.subject}</strong><br/></>}
                {!action.sender && !action.inbox && !action.subject ? <strong>*</strong> : null}
              </td>
              <td>{action.priority}</td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setCurrentAction(action)}
                >Show</Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => deleteActionMutation.mutate(action.id)}
                  disabled={deleteActionMutation.isPending}
                  className="ms-1"
                >Delete</Button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <AddActionModal show={addModalOpen} onClose={handleAddModalClose} />
      <ActionsDetailsModal action={currentAction} onClose={() => setCurrentAction(null)} />
    </>
  )
}