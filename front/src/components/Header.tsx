import React from 'react'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

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
          <LinkContainer to='/mails'>
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
