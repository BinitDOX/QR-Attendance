import { NavLink } from 'react-router-dom';

import QRCodeIcon from '@mui/icons-material/QrCode2';
import classes from './Header.module.css';

const Header = () => {
  return (
    <header className={classes.header}>
      <nav>
        <div className={classes.logo}>
          <NavLink className={(navData) => navData.isActive ? classes.active : ''} to='/'>
            <QRCodeIcon sx={{fontSize: '4rem'}}/>
          </NavLink>
        </div>
        <ul>
          <li>
            <NavLink className={(navData) => navData.isActive ? classes.active : ''} to='/student'>
              Student
            </NavLink>
          </li>
          <li>
            <NavLink className={(navData) => navData.isActive ? classes.active : ''} to='/professor'>
              Professor
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;