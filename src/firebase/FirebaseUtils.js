import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { firebaseConfig } from './FirebaseConfig';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const signInWithGoogle = (displayToastHandler) => {
  signInWithPopup(auth, provider).then((result) => {
    displayToastHandler(`Authentication Successsful`, 'success');
    console.log(result);
  }).catch((error) => {
    switch(error.code){
      case 'auth/popup-closed-by-user':
        displayToastHandler(`Authentication Cancelled`, 'warning');
        break;
      default:
        displayToastHandler(`${error.message}`, 'error');
        break;
    }
    console.log(error);
  });
}
