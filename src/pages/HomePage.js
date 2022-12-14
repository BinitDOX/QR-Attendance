import Header from '../components/Header';
import Logo from '../assets/logo-main.png';

import classes from './HomePage.module.css';

const HomePage = (props) => {
  return (
    <>
      <Header />
      <div className={classes.homepage}>
        <div className={classes.title}>
          QR Attendance
        </div>
        <div className={classes.logo}>
          <img src={Logo} alt='Logo Here'/>
        </div>
      </div>
    </>
  );
};

export default HomePage;
