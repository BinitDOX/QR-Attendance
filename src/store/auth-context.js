import React, { useState } from 'react';

const AuthContext = React.createContext({
  token: '',
  uid: '',
  email: '',
  name: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {}
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem('token');
  const initialUID = localStorage.getItem('uid');
  const initialEmail = localStorage.getItem('email');
  const [authDetails, setAuthDetails] = useState({
    token: initialToken,
    uid: initialUID,
    email: initialEmail,
    name: ''
  });
  
  const isLoggedIn = !!authDetails.token;

  const loginHandler = (token, uid, email, name) => {
    setAuthDetails({
      token: token,
      uid: uid,
      email: email,
      name: name
    });
    localStorage.setItem('token', token);
    localStorage.setItem('uid', uid);
    localStorage.setItem('email', email);
  }

  const logoutHandler = () => {
    setAuthDetails({
      token: null,
      uid: null,
      email: null,
      name: ''
    });
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    localStorage.removeItem('email');
  }

  const contextvalue = {
    token: authDetails.token,
    uid: authDetails.uid,
    email: authDetails.email,
    name: authDetails.name,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  }

  return <AuthContext.Provider value={contextvalue}> {props.children} </AuthContext.Provider>;
}

export default AuthContext;