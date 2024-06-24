import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteMail, getMail } from "../api/mail";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import EmailRenderer from "../components/EmailRenderer";

export default function Mail() {
  const { id } = useParams();
  if (!id) {
    throw new Error("No id provided");
  }

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { error, data: mail } = useQuery({
    queryKey: ['mailDetails', id],
    queryFn: () => getMail(parseInt(id)),
  });

  const deleteMailMutation = useMutation({
    mutationFn: () => deleteMail(parseInt(id)),
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['mail']});
    },
    onSuccess: () => {
      navigate("..", {replace: true});
    },
  });



  return (
    <>
      {error && <ErrorMessage message={error.toString()}/>}
      {deleteMailMutation.error && <ErrorMessage message={deleteMailMutation.error.toString()}/>}

      {mail && <>
        <Row className="py-4 fs-4 justify-content-between" xs="auto">
          <Col>
            <strong>{mail.subject.trim().length === 0 ? '(No subject)' : mail.subject}</strong>
          </Col>
          <Col>
            <Button variant="danger" onClick={() => deleteMailMutation.mutate()}>Delete</Button>
          </Col>
        </Row>
        <Row className="pb-2" xs="auto">
          <Col>
            From <Link to={{pathname: '/mail', search: new URLSearchParams({sender: mail.sender}).toString()}} >
              {mail.sender}
            </Link> to <Link to={{pathname: '/mail', search: new URLSearchParams({inbox: mail.inbox}).toString()}} >
              {mail.inbox}
            </Link> 
          </Col>
        </Row>
        <Row className="py-2 mb-5" xs="auto">
          <Col xs="12">
            <EmailRenderer body={mail.body} />
          </Col>
        </Row>
      </>}

    </>
  )
}