import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, setDoc, collection } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { firebaseConfig } from './FirebaseConfig';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = (displayToastHandler, displayLoaderHandler, authContext) => {
  displayLoaderHandler(true);
  signInWithPopup(auth, provider).then((result) => {
    console.log(result);
    authContext.login(result.user.accessToken, result.user.uid, result.user.email, result.user.displayName);
    displayToastHandler(`Authentication Successsful`, 'success');
  }).catch((error) => {
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        displayToastHandler(`Authentication Cancelled`, 'warning');
        break;
      default:
        displayToastHandler(`${error.message}`, 'error');
        break;
    }
    console.log(error);
  }).finally(() => {
    displayLoaderHandler(false);
  });
}

export const fetchUserData = async (authContext) => {
  if (!authContext || !authContext.token) return;

  const { uid, email } = authContext;
  const userRef = doc(db, 'users', uid);
  let userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const usersRef = collection(db, 'users')
    const timestamp = new Date();

    try {
      await setDoc(doc(usersRef, uid), {
        rollno: '',
        name: '',
        email: email,
        createdDate: timestamp,
        mark: false,
        courses: []
      });
    } catch (err) {
      console.log(err);
    }
  }

  userSnap = await getDoc(userRef);
  return userSnap;
};

export const writeUserData = async (
  authContext, userDetails, displayToastHandler, displayLoaderHandler, closeModalHandler
) => {
  displayLoaderHandler(true);
  if (!authContext || !authContext.token) {
    displayToastHandler('No valid Auth, please refresh', 'error');
    displayLoaderHandler(false);
    setTimeout(closeModalHandler, 2200);
    return;
  }

  const { uid } = authContext;
  const usersRef = collection(db, 'users')
  const userRef = doc(db, 'users', uid);

  try {
    await setDoc(doc(usersRef, uid), {
      rollno: userDetails.rollno,
      name: userDetails.name,
      mark: false
    }, { merge: true });
    displayToastHandler('Data saved successfully', 'success');
  } catch (err) {
    displayToastHandler(err, 'error');
    console.log(err);
  }

  displayLoaderHandler(false);
  setTimeout(closeModalHandler, 2200);
  const userSnap = await getDoc(userRef);
  return userSnap;
};

export const fetchCourseData = async (authContext) => {
  if (!authContext || !authContext.token) return;

  const { uid, email } = authContext;
  const userRef = doc(db, 'users', uid);
  let userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const usersRef = collection(db, 'users')
    const timestamp = new Date();

    try {
      await setDoc(doc(usersRef, uid), {
        rollno: '',
        name: '',
        email: email,
        createdDate: timestamp,
        mark: false,
        courses: []
      });
    } catch (err) {
      console.log(err);
    }
  }

  userSnap = await getDoc(userRef);
  return userSnap;
};

export const writeCourseData = async (
  authContext, courseDetails, displayToastHandler, displayLoaderHandler, closeModalHandler
) => {
  displayLoaderHandler(true);
  if (!authContext || !authContext.token) {
    displayToastHandler('No valid Auth, please refresh', 'error');
    displayLoaderHandler(false);
    setTimeout(closeModalHandler, 2200);
    return;
  }

  const { uid } = authContext;
  const usersRef = collection(db, 'users')
  const userRef = doc(db, 'users', uid);

  try {
    await setDoc(doc(usersRef, uid), {
      courses: {[courseDetails.course] : {}}
    }, { merge: true });
    displayToastHandler('Data saved successfully', 'success');
  } catch (err) {
    displayToastHandler(err, 'error');
    console.log(err);
  }

  displayLoaderHandler(false);
  setTimeout(closeModalHandler, 2200);
  const userSnap = await getDoc(userRef);
  return userSnap;
};


export const writeAttendanceData = async (
  authContext, attendanceDetails, displayToastHandler, displayLoaderHandler, closeModalHandler
) => {
  displayLoaderHandler(true);
  if (!authContext || !authContext.token) {
    displayToastHandler('No valid Auth, please refresh', 'error');
    displayLoaderHandler(false);
    setTimeout(closeModalHandler, 2200);
    return null;
  }

  const { uid } = authContext;
  const usersRef = collection(db, 'users');
  const userRef = doc(db, 'users', uid);
  const userRefAway = doc(db, 'users', attendanceDetails.uid);

  const userSnapAway = await getDoc(userRefAway);

  if (!userSnapAway.exists()) {
    displayToastHandler('Bad QR-Code', 'error');
    displayLoaderHandler(false);
    return null;
  }

  try {
    await setDoc(doc(usersRef, uid), {
      courses: {[attendanceDetails.course] : {[attendanceDetails.date] : {[attendanceDetails.uid] : true}}}
    }, { merge: true });
    displayToastHandler('Attendance Marked', 'success');
  } catch (err) {
    displayToastHandler(err, 'error');
    console.log(err);
  }

  try {
    await setDoc(doc(usersRef, attendanceDetails.uid), {
      mark: true
    }, { merge: true });
  } catch (err) {
    console.log(err);
  }

  displayLoaderHandler(false);
  setTimeout(closeModalHandler, 2200);
  const userSnap = await getDoc(userRef);
  return userSnap;
};


export const fetchUserMarked = async (authContext) => {
  if (!authContext || !authContext.token) return;

  const { uid } = authContext;
  const userRef = doc(db, 'users', uid);
  let userSnap = await getDoc(userRef);
  let marked = false;

  if (userSnap.exists()) 
    marked = userSnap.data().mark;
  
  return marked;
}

export const writeUserMark = async (
  authContext, displayToastHandler, displayLoaderHandler, closeModalHandler
) => {
  displayLoaderHandler(true);
  if (!authContext || !authContext.token) {
    displayToastHandler('No valid Auth, please refresh', 'error');
    displayLoaderHandler(false);
    setTimeout(closeModalHandler, 2200);
    return;
  }

  const { uid } = authContext;
  const usersRef = collection(db, 'users')

  try {
    await setDoc(doc(usersRef, uid), {
      mark: false
    }, { merge: true });
    displayToastHandler('Attendance State Reset', 'success');
  } catch (err) {
    displayToastHandler('Attendance State Reset', 'error');
    console.log(err);
  }

  displayLoaderHandler(false);
  setTimeout(closeModalHandler, 2200);
};

export const readFullDatabase = async (authContext) => {
  if (!authContext || !authContext.token) return;

  const usersRef = collection(db, 'users');
  let userSnaps = await getDocs(usersRef);
  let snapshots = {};
  userSnaps.docs.forEach(doc => {
    snapshots = {...snapshots, [doc.id] : doc.data()};
  });
  return snapshots;
}