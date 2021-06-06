import React from 'react'
import { Alert } from 'react-bootstrap'

interface IProps {
  message?: string;
}

export default function ErrorMessage(props: IProps) {
  if (props.message) {
    return (
      <Alert variant="danger" className="my-4">
        <Alert.Heading>Error</Alert.Heading>
        <p>{props.message}</p>
      </Alert>
    )
  }
  return (null);
}
