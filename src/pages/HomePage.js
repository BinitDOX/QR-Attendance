import Header from '../components/Header';

import classes from './HomePage.module.css';

const HomePage = (props) => {
  return (
    <>
      <Header />
      <div className={classes.homepage}>
        <div className={classes.title}>
          QR-Attendance
        </div>
        <div className={classes.logo}>
          ------------ Logo Goes Here ------------
        </div>
      </div>
    </>
  );
};

export default HomePage;
