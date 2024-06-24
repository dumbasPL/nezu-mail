import Alert from 'react-bootstrap/Alert'

export default function ErrorMessage(props: {
  message: string;
}) {
  return (
    <Alert variant="danger" className="my-4">
      <Alert.Heading>Error</Alert.Heading>
      <p>{props.message}</p>
    </Alert>
  )
}
