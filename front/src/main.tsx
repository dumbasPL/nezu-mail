import React from 'react'
import ReactDOM from 'react-dom/client'
import './App.scss';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Domains from './routes/Domains';
import Tokens from './routes/Tokens';
import Actions from './routes/Actions';
import Mails from './routes/Mails';
import Header from './components/Header';
import Mail from './routes/Mail';

const router = createBrowserRouter([
  {
    path: "/",
    element: <>
      <Header/>
      <Container>
        <Outlet/>
      </Container>
    </>,
    children: [
      {
        path: "",
        element: <Navigate to="/mail" />,
      },
      {
        path: "mail",
        element: <Mails />,
      },
      {
        path: "mail/:id",
        element: <Mail />,
      },
      {
        path: "tokens",
        element: <Tokens />,
      },
      {
        path: "domains",
        element: <Domains />,
      },
      {
        path: "actions",
        element: <Actions />,
      },
    ],
  },
]);

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
