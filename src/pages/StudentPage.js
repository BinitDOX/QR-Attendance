import { useState, useContext, useEffect } from 'react';
import { useSnackbar } from "notistack";
import Button from '@mui/material/Button';
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';

import GoogleIcon from '@mui/icons-material/Google';
import QRCodeIcon from '@mui/icons-material/QrCode2';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import Header from '../components/Header';
import Loader from "../components/Loader";
import Details from '../components/Details';
import QRCode from '../components/QRCode';
import AuthContext from '../store/auth-context';
import { fetchUserData, writeUserData, signInWithGoogle } from '../firebase/FirebaseUtils';

import './StudentPage.css';

const StudentPage = (props) => {
  // Initializers
  const initialDetails = { name: '', rollno: '', email: '' };
  const authContext = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [showLoader, setLoader] = useState(false);
  const [details, setDetails] = useState({ ...initialDetails });
  const [errors, setErrors] = useState({ ...initialDetails });
  const [openDetails, setOpenDetails] = useState(false);
  const [openQRC, setOpenQRC] = useState(false);


  // Asyncs:
  const writeToDatabase = async () => {
    const userSnap = await writeUserData(
      authContext, details, displayToastHandler, displayLoaderHandler, closeDetailsHandler
    );
    console.log(userSnap.data());
  };

  const readFromDatabase = async () => {
    const userSnap = await fetchUserData(authContext);
    console.log(userSnap.data());
    setDetails({ ...userSnap.data() });
    return userSnap.data();
  }


  // Hooks
  useEffect(() => {
    console.log(authContext);
    if (authContext.token) {
      readFromDatabase();
    } else {
      setDetails({ ...initialDetails })
    }
  }, [authContext]);


  // Handlers
  const displayToastHandler = (message, severity) => enqueueSnackbar(message, { variant: severity });
  const displayLoaderHandler = (show) => setLoader(show);
  const openDetailsHandler = () => setOpenDetails(true);
  const closeDetailsHandler = () => setOpenDetails(false);
  const openQRCHandler = () => setOpenQRC(true);
  const closeQRCHandler = () => setOpenQRC(false);

  const inputChangeHandler = (event) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [event.target.name]: event.target.value,
    }));

    let updatedErrors = { ...errors };
    updatedErrors = validateInput(
      event.target.name,
      event.target.value,
      updatedErrors
    );
    setErrors({ ...updatedErrors });
  };

  const submitHandler = () => {
    displayLoaderHandler(true);
    let updatedErrors = { ...errors };

    for (var key in details)
      if (details.hasOwnProperty(key))
        updatedErrors = validateInput(key, details[key], updatedErrors);

    setErrors({ ...updatedErrors });
    const fastErrors = { ...updatedErrors };

    let readyToCommit = true;
    for (var fkey in fastErrors)
      if (fastErrors.hasOwnProperty(fkey))
        if (fastErrors[fkey] !== "")
          readyToCommit = false;

    console.log("Ready:", readyToCommit);
    if (readyToCommit) {
      writeToDatabase();
    }
    displayLoaderHandler(false);
  }

  const generateQRHandler = () => {
    displayLoaderHandler(true);
    readFromDatabase().then((data) => {
      if (data.name === '' || data.rollno === '' || data.email === '') {
        displayToastHandler('Edit your details before generating QRC', 'error');
        return;
      }

      openQRCHandler();
      setErrors(initialDetails);
    }).catch((err) => {
      console.log(err);
      displayToastHandler('Something went wrong', 'error');
    }).finally(() => {
      displayLoaderHandler(false);
    });
  }


  // Validators
  const validateInput = (field, value, updatedErrors) => {
    switch (field) {
      case "name":
        if (value.length === 0)
          updatedErrors[field] = "Cannot be empty";
        else if (value.length < 4)
          updatedErrors[field] = "Length should be greater than 4";
        else if (value.length > 30)
          updatedErrors[field] = "Length should be smaller than 30";
        else if (!(/^[a-zA-Z ]+$/.test(value)))
          updatedErrors[field] = "Should only contain alphabets [a-z]";
        else updatedErrors[field] = "";
        break;
      case "rollno":
        if (value.length === 0)
          updatedErrors[field] = "Cannot be empty";
        else if (value.length < 5)
          updatedErrors[field] = "Length should be greater than 5";
        else if (value.length > 20)
          updatedErrors[field] = "Length should be smaller than 20";
        else if (!(/^\d+$/.test(value)))
          updatedErrors[field] = "Should only contain digits [0-9]";
        else updatedErrors[field] = "";
        break;
      case "email":
        if (value == null || value.length === 0)
          updatedErrors[field] = "Cannot be empty";
      default:
        break;
    }
    return updatedErrors;
  };


  // Renders
  return (
    <>
      <Loader show={showLoader} />
      <Header />
      <div className='studentpage'>
        {!authContext.isLoggedIn ?
          <Button variant="outlined" startIcon={<GoogleIcon />} onClick={() => signInWithGoogle(displayToastHandler, displayLoaderHandler, authContext)}>
            Sign in with Google
          </Button> :
          <>
            <Modal
              open={openDetails}
              onClose={closeDetailsHandler}
              aria-labelledby="Student Details"
              aria-describedby="User can edit his details here"
            >
              <Box sx={styleDetails}>
                <Details data={details} errors={errors} onChangeHandler={inputChangeHandler} onSubmitHandler={submitHandler} />
              </Box>
            </Modal>

            <Modal
              open={openQRC}
              onClose={closeQRCHandler}
              aria-labelledby="QRCode"
              aria-describedby="Generated QRC is displayed here"
            >
              <Box sx={styleDetails}>
                <QRCode data={details} uid={authContext.uid} />
              </Box>
            </Modal>

            <Button sx={{ m: 2 }} variant="outlined" startIcon={<ManageAccountsIcon />} onClick={openDetailsHandler}>
              My Details
            </Button>
            <Button sx={{ m: 2 }} variant="outlined" startIcon={<QRCodeIcon />} onClick={generateQRHandler}>
              Generate QRC
            </Button>

            <Button className='logout' sx={{ m: 2 }} variant="outlined" startIcon={<LogoutIcon />} onClick={authContext.logout}>
              LogOut
            </Button>
          </>
        }
      </div>
    </>
  );
};

const styleDetails = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  height: '70%',
  bgcolor: '#00000099',
  border: '2px solid #000',
  boxShadow: 24,
  p: 0,
};

export default StudentPage;