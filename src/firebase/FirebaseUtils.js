import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, getDocs, setDoc, addDoc, collection } from 'firebase/firestore';
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
        mark: false
      });
    } catch (err) {
      console.log(err);
    }
  }

  userSnap = await getDoc(userRef);
  return userSnap;
};

export const writeUserData = async (
    authContext, userDetails, displayToastHandler, displayLoaderHandler, closeDetailsHandler
  ) => {
  displayLoaderHandler(true);
  if (!authContext || !authContext.token) {
    displayToastHandler('No valid Auth, please refresh', 'error');
    displayLoaderHandler(false);
    setTimeout(closeDetailsHandler, 2200);
    return;
  }

  const { uid, email } = authContext;
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
  setTimeout(closeDetailsHandler, 2200);
  const userSnap = await getDoc(userRef);
  return userSnap;
};