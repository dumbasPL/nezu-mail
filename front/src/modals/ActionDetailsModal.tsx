import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Action, ReplaceAction, WebhookAction } from '../api/action';

export default function ActionsDetailsModal(props: {
  action: Action | null;
  onClose: () => void;
}) {
  const getActionOptions = (action: Action) => {
    switch (action.className) {
      case 'DeleteAction': return null;
      case 'DiscordWebhookAction':
      case 'WebhookAction':
        return (
          <p>Webhook URL: <strong>{(action as WebhookAction).webhookUrl}</strong></p>
        )
      case 'ReplaceAction':
        return (
          <>
            <p>Regex: <strong>{(action as ReplaceAction).regex}</strong></p>
            <p>Replacement: <strong>{(action as ReplaceAction).replacement}</strong></p>
          </>
        )
      default:
        return null;
    }
  }

  return (
    <Modal show={props.action != null} onHide={props.onClose}>
      <Modal.Header closeButton>{props.action?.name}</Modal.Header>
      <Modal.Body style={{overflowWrap: 'break-word'}}>
        {props.action && <>
          <p>Inbox regex: <strong>{props.action?.inbox ?? '*'}</strong></p>
          <p>Sender regex: <strong>{props.action?.sender ?? '*'}</strong></p>
          <p>Subject regex: <strong>{props.action?.subject ?? '*'}</strong></p>
          <p>Action priority: <strong>{props.action?.priority}</strong></p>
          <p>Action type: <strong>{props.action?.className}</strong></p>
          {getActionOptions(props.action)}
          <p>Last error: <strong>{props.action?.lastError ?? '-'}</strong></p>
        </>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        </Modal.Footer>
    </Modal>
  )
}