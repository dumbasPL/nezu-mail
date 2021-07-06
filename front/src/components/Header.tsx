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
            <Nav.Link>Emails</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/tokens'>
            <Nav.Link>API Tokens</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/domains'>
            <Nav.Link>Domains</Nav.Link>
          </LinkContainer>
        </Nav>
      </Container>
    </Navbar>
  )
}
