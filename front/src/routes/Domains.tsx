import ErrorMessage from "../components/ErrorMessage";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDomain, getDomains } from "../api/domain";
import AddDomainModal from "../modals/AddDomainModal";
import { useState } from "react";

export default function Domains() {
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);

  const { error, data: domains } = useQuery({
    queryKey: ['domains'],
    queryFn: getDomains,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDomain,
    onSettled: () => {
      queryClient.invalidateQueries({queryKey: ['domains']});
    }
  })

  const handleModalClose = () => {
    setModalOpen(false);
    queryClient.invalidateQueries({queryKey: ['domains']});
  }

  return (
    <>
      {error && <ErrorMessage message={error.toString()}/>}

      <Row className="justify-content-between my-4">
        <Col xs="auto">
          <h4>Domains</h4>
        </Col>
        <Col xs="auto">
          <Button variant="success" onClick={() => setModalOpen(true)}>New domain</Button>
        </Col>
      </Row>

      <Table>
        <thead>
          <tr>
            <th>domain</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {domains?.map(domain => {
            return (
              <tr key={domain}>
                <td>{domain}</td>
                <td>
                  <Button variant="danger" onClick={() => deleteMutation.mutate(domain)}>Delete</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <AddDomainModal show={modalOpen} onClose={handleModalClose} />
    </>
  )
}