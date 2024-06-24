import ErrorMessage from "../components/ErrorMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import AddTokenModal from "../modals/AddTokenModal";
import { deleteToken, getTokens } from "../api/token";

export default function Tokens() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);

  const { error, data: tokens } = useQuery({
    queryKey: ['tokens'],
    queryFn: getTokens,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteToken,
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['tokens']});
    }
  })

  const handleModalClose = () => {
    setModalOpen(false);
    queryClient.invalidateQueries({queryKey: ['tokens']});
  }

  return (
    <>
      {error && <ErrorMessage message={error.toString()}/>}

      <Row className="justify-content-between my-4">
        <Col xs="auto">
          <h4>API Tokens</h4>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={() => setModalOpen(true)}>New token</Button>
        </Col>
      </Row>

      <Table>
        <thead>
          <tr>
            <th>name</th>
            <th>token</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {tokens?.map(({token, name}) => {
            return (
              <tr key={token}>
                <td>{name}</td>
                <td>{token}</td>
                <td>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(token)}>Delete</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <AddTokenModal show={modalOpen} onClose={handleModalClose} />
    </>
  )
}