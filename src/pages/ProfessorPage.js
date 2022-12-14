import { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import { QrReader } from 'react-qr-reader';
import { useSnackbar } from "notistack";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from "@mui/material/Modal";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import GoogleIcon from '@mui/icons-material/Google';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Loader from "../components/Loader";
import AuthContext from '../store/auth-context';
import { fetchUserData, writeUserData, signInWithGoogle } from '../firebase/FirebaseUtils';

import './ProfessorPage.css';

const ProfessorPage = (props) => {
  // Initializers
  const authContext = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState('No result');
  const [showLoader, setLoader] = useState(false);
  const [openAddCourse, setOpenAddCourse] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Handlers
  const displayToastHandler = (message, severity) => enqueueSnackbar(message, { variant: severity });
  const displayLoaderHandler = (show) => setLoader(show);
  const openAddCourseHandler = () => setOpenAddCourse(true);
  const closeAddCourseHandler = () => setOpenAddCourse(false);

  return (
    <>
      <Header />
      <div className='professorpage'>
        {!authContext.isLoggedIn ?
          <Button variant="outlined" startIcon={<GoogleIcon />} onClick={() => signInWithGoogle(displayToastHandler, displayLoaderHandler, authContext)}>
            Sign in with Google
          </Button> :
          <>
            <Modal
              open={openAddCourse}
              onClose={closeAddCourseHandler}
              aria-labelledby="Course Name"
              aria-describedby="User add new course record here"
            >
              <Box sx={styleDetails}>

              </Box>
            </Modal>

            <Button variant="outlined" startIcon={<NoteAddIcon />} onClick={openAddCourseHandler}>
              Add New Course
            </Button>

            <div className='attendancerecords'>
              <Box sx={{ width: '100%', maxWidth: 360, bgcolor: '#0000005c' }}>
                <List sx={{overflow: 'auto', maxHeight: 300, padding: 0}}>
                  
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <AssignmentIcon/>
                      </ListItemIcon>
                      <ListItemText primary="Trash" />
                    </ListItemButton>
                  </ListItem>
                  
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <AssignmentIcon />
                      </ListItemIcon>
                      <ListItemText primary="Spam" />
                    </ListItemButton>
                  </ListItem>

                </List>
              </Box>
            </div>

            {/* <QrReader
            onResult={(result, error) => {
              if (!!result) {
                setData(result?.text);
              }

              if (!!error) {
                //console.info(error);
              }
            }}
            style={{ width: '100%' }}
          />
          <p>{data}</p> */}
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

export default ProfessorPage;
