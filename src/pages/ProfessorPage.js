import { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import { QrReader } from 'react-qr-reader';
import exportFromJSON from 'export-from-json'
import { useSnackbar } from "notistack";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Modal from "@mui/material/Modal";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import InputAdornment from '@mui/material/InputAdornment';
import GoogleIcon from '@mui/icons-material/Google';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import NearMeIcon from '@mui/icons-material/NearMe';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';

import Loader from "../components/Loader";
import AuthContext from '../store/auth-context';
import InputField from '../components/InputField';
import { writeCourseData, fetchCourseData, writeAttendanceData, readFullDatabase, signInWithGoogle } from '../firebase/FirebaseUtils';

import './ProfessorPage.css';

const ProfessorPage = (props) => {
  // Initializers
  let QRDataPrev = '';
  const initialDetails = { id: '', course: '' };
  const authContext = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [QRData, setQRData] = useState('');
  const [showLoader, setLoader] = useState(false);
  const [openAddCourse, setOpenAddCourse] = useState(false);
  const [openQRScanner, setOpenQRScanner] = useState(false);
  const [details, setDetails] = useState({ ...initialDetails });
  const [errors, setErrors] = useState({ ...initialDetails });
  const [record, setRecord] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState({});


  // Asyncs:
  const writeCourseDataToDatabase = async () => {
    const userSnap = await writeCourseData(
      authContext, details, displayToastHandler, displayLoaderHandler, closeAddCourseHandler
    );
    setAttendanceRecords({ ...userSnap.data().courses });
    return userSnap.data().courses;
  };

  const readCourseDataFromDatabase = async () => {
    displayLoaderHandler(true);
    const userSnap = await fetchCourseData(authContext);
    setAttendanceRecords({ ...userSnap.data().courses });
    displayLoaderHandler(false);
    return userSnap.data().courses;
  }

  const writeAttendanceToDataBase = async (attendanceData) => {
    const userSnap = await writeAttendanceData(
      authContext, attendanceData, displayToastHandler, displayLoaderHandler, closeAddCourseHandler
    );
    return userSnap === null ? '' : attendanceData.uid;
  }

  // Hooks
  useEffect(() => {
    if (authContext.token) {
      readCourseDataFromDatabase();
    } else {
      setDetails({ ...initialDetails })
    }
  }, [authContext]);


  // Handlers
  const displayToastHandler = (message, severity) => enqueueSnackbar(message, { variant: severity });
  const displayLoaderHandler = (show) => setLoader(show);
  const openAddCourseHandler = () => setOpenAddCourse(true);
  const closeAddCourseHandler = () => setOpenAddCourse(false);
  const openQRScannerHandler = () => setOpenQRScanner(true);
  const closeQRScannerHandler = () => setOpenQRScanner(false);

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
      writeCourseDataToDatabase();
    }
    displayLoaderHandler(false);
  }

  const recordClickedHandler = (value) => {
    setRecord(value);
    openQRScannerHandler();
  }

  const markAttendanceHandler = (data) => {
    if (QRDataPrev === data)
      return;

    QRDataPrev = data;
    const date = new Date().toLocaleString("en-Us", { timeZone: 'Asia/Kolkata' }).slice(0, 10);
    const attendanceData = { course: record, uid: data, date: date };
    console.log(attendanceData);

    writeAttendanceToDataBase(attendanceData)
      .then((res) => {
        QRDataPrev = res;
      });
  }

  const downloadCSVHandler = (data) => {
    const fileName = record;
    const exportType = exportFromJSON.types.xls;

    exportFromJSON({ data, fileName, exportType});
  }

  // Direct Async Handler [Best Method]
  const generateCSVHandler = async () => {
    displayLoaderHandler(true);
    const db = await readFullDatabase(authContext);
    console.log(db);
    const courses = db[authContext.uid].courses;
    let userMap = {}

    console.log(courses[record]);
    try {
      for (const [date, users] of Object.entries(courses[record])) {
        for (const [user, marker] of Object.entries(users)) {
          const prev = userMap[user];
          userMap = { ...userMap, [user]: { ...prev, [date]: marker } }
        }
      }

      for (const [user, data] of Object.entries(userMap)) {
        const prev = userMap[user];
        userMap = {
          ...userMap, [user]: {
            RollNo: db[user].rollno, Name: db[user].name, Email: db[user].email, ...prev
          }
        }
      }
      // console.log(userMap);
      downloadCSVHandler(Object.values(userMap));
    } catch (err) {
      displayToastHandler('Internal error', 'error');
      console.log(err);
    } finally {
      displayLoaderHandler(false);
    }
  }


  // Validators
  function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
  }

  const validateInput = (field, value, updatedErrors) => {
    switch (field) {
      case "course":
        if (value.length === 0)
          updatedErrors[field] = "Cannot be empty";
        else if (value.length < 4)
          updatedErrors[field] = "Length should be greater than 4";
        else if (value.length > 30)
          updatedErrors[field] = "Length should be smaller than 30";
        else if (!isASCII(value))
          updatedErrors[field] = "Should only be ASCII";
        else updatedErrors[field] = "";
        break;
      default:
        break;
    }
    return updatedErrors;
  };

  return (
    <>
      <Loader show={showLoader} />
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
                <div className='details'>
                  <Typography sx={{ m: 1 }} variant='h3' component='h3' align='center'>
                    ADD COURSE
                  </Typography>

                  <div className='detailsinput'>
                    <InputField
                      sx={{ m: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DriveFileRenameOutlineIcon />
                          </InputAdornment>
                        ),
                      }}
                      id="input-course"
                      name='course'
                      value={details.course}
                      autoComplete='off'
                      onChange={inputChangeHandler}
                      label="COURSE"
                      error={errors.course.length !== 0}
                      helperText={errors.course}
                    />
                  </div>

                  <div className='submitbutton'>
                    <Button sx={{ m: 2 }} variant="outlined" size='large' endIcon={<NearMeIcon />} onClick={submitHandler}>
                      SAVE COURSE
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>

            <Modal
              open={openQRScanner}
              onClose={closeQRScannerHandler}
              aria-labelledby="QR Scanner"
              aria-describedby="Scan for QRCs here"
            >
              <Box sx={styleDetails}>
                <div className='details'>
                  <Typography sx={{ m: 1 }} variant='h3' component='h3' align='center'>
                    QR SCANNER
                  </Typography>

                  <div className='qrreader'>
                    <QrReader
                      onResult={(result, error) => {
                        if (!!result) {
                          setQRData(result?.text);
                          markAttendanceHandler(result?.text);
                        }

                        if (!!error) {
                          //console.info(error);
                        }
                      }}
                      style={{ width: '100%' }}
                    />
                    <p> {QRData} </p>
                  </div>

                  <div className='submitbutton'>
                    <Button sx={{ m: 2 }} variant="outlined" size='large' endIcon={<DownloadIcon />} onClick={generateCSVHandler}>
                      GENERATE CSV
                    </Button>
                  </div>
                </div>
              </Box>
            </Modal>

            <Button variant="outlined" startIcon={<NoteAddIcon />} onClick={openAddCourseHandler}>
              Add New Course
            </Button>

            <div className='attendancerecords'>
              <Box sx={{ width: '100%', maxWidth: 360, bgcolor: '#0000005c' }}>
                <List sx={{ overflow: 'auto', maxHeight: 300, padding: 0 }}>
                  {Object.keys(attendanceRecords).sort().map((record) => {
                    return (
                      <ListItem key={record} disablePadding>
                        <ListItemButton onClick={() => recordClickedHandler(record)}>
                          <ListItemIcon>
                            <AssignmentIcon />
                          </ListItemIcon>
                          <ListItemText primary={record} />
                        </ListItemButton>
                      </ListItem>);
                  })}

                </List>
              </Box>
            </div>

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

export default ProfessorPage;
