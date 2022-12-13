import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

import { useSnackbar } from "notistack";

import Header from '../components/Header';
import { signInWithGoogle } from '../firebase/FirebaseUtils';

import classes from './StudentPage.module.css';

const StudentPage = (props) => {
  const { enqueueSnackbar } = useSnackbar();

  const displayToastHandler = (message, severity) => {
    enqueueSnackbar(message, { variant: severity });
  };

  return (
    <>
      <Header />
      <div className={classes.studentpage}>
        <Button variant="outlined" startIcon={<GoogleIcon />} onClick={() => signInWithGoogle(displayToastHandler)}>
          Sign in with Google
        </Button>
      </div>
    </>
  );
};

export default StudentPage;