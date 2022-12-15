import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SnackbarProvider, closeSnackbar } from "notistack";
import { Collapse } from '@mui/material';

import App from './App';
import { AuthContextProvider } from './store/auth-context';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <SnackbarProvider
        maxSnack={4}
        action={(snackbarId) => (
          <button onClick={() => closeSnackbar(snackbarId)}>
            Dismiss
          </button>
        )}
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
