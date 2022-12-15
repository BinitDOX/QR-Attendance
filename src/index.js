import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from "notistack";
import { Collapse } from '@mui/material';
import Button from '@mui/material/Button';

import App from './App';
import { AuthContextProvider } from './store/auth-context';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

const DismissAction = ({ id }) => {
  const { closeSnackbar } = useSnackbar()
  return (
    <Button sx={{color: 'white'}} onClick={() => closeSnackbar(id)}>Close</Button>
  )
}

root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <SnackbarProvider
        maxSnack={4}
        action={key => <DismissAction id={key} />}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        TransitionComponent={Collapse}
      >
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </SnackbarProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
