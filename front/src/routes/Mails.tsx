import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMails } from "../api/mail";
import ErrorMessage from "../components/ErrorMessage";
import {socket} from "../api/socket";
import { useEffect, useRef, useState } from "react";
import throttle from "lodash.throttle";
import EmailHeader from "../components/EmailHeader";
import TimeAgo from 'react-timeago';
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const PER_PAGE = 25;

export default function Mails() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [isConnected, setIsConnected] = useState(socket.connected);
  // const [search, setSearch] = useState('');

  const sender = searchParams.get('sender') ?? undefined;
  const inbox = searchParams.get('inbox') ?? undefined;
  const search = searchParams.get('search') ?? undefined;
  const page = parseInt(searchParams.get('page') ?? '') || 0;

  const setParam = (key: string, value: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      [key]: value,
    });
  }

  const { error, data: emails, isFetching } = useQuery({
    queryFn: ({signal}) => getMails({perPage: PER_PAGE, page, search, sender, inbox, signal}),
    queryKey: ['mails', PER_PAGE, page, search, sender, inbox],
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    socket.connect();
    return () => void socket.disconnect();
  }, []);

  const invalidateMails = useRef(throttle(() => {
    queryClient.invalidateQueries({queryKey: ['mails']})
  }, 500, {
    leading: true,
    trailing: true,
  }));

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onMail() {
      invalidateMails.current();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('mail', onMail);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('mail', onMail);
    };
  }, [invalidateMails])

  return (
    <>
      {error && <ErrorMessage message={error.toString()} />}

      <EmailHeader
        mailCount={emails?.total ?? 0}
        connected={isConnected}
        loading={isFetching}
        onSearch={value => setParam('search', value)}
      />

      <Table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Subject</th>
            <th>Sender</th>
            <th>Inbox</th>
          </tr>
        </thead>
        <tbody>
          {emails?.data?.map(mail =>
            <tr key={mail.id}>
              <td>
                <TimeAgo date={mail.date} />
              </td>
              <td>
                <Link to={mail.id.toString()}>
                  {mail.subject.trim().length === 0 ? '(No subject)' : mail.subject} 
                </Link>
              </td>
              <td>{mail.sender}</td>
              <td>{mail.inbox}</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Row className="justify-content-md-center">
        <Col xs="auto">
          <Pagination
            total={emails?.total ?? 0}
            curPage={page}
            onClick={page => setParam('page', page.toString())}
            perPage={PER_PAGE}
          />
        </Col>
      </Row>
    </>
  )
}