import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";


export default function Header() {
  return (
    <Navbar bg='primary' variant="dark">
      <Container>
        <LinkContainer to='/'>
          <Navbar.Brand>
            Nezu-mail
          </Navbar.Brand>
        </LinkContainer>
        <Nav>
          <LinkContainer to='/mail'>
            <Nav.Link active={false}>Emails</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/tokens'>
            <Nav.Link active={false}>API Tokens</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/domains'>
            <Nav.Link active={false}>Domains</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/actions'>
            <Nav.Link active={false}>Actions</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  )
}