import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import InputAdornment from '@mui/material/InputAdornment';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NearMeIcon from '@mui/icons-material/NearMe';

import InputField from './InputField';

import './Details.css';

const Details = (props) => {
  const data = props.data;
  const errors = props.errors;

  return (
    <div className='details'>
      <Typography sx={{ m: 1 }} variant='h3' component='h3' align='center'>
        DETAILS
      </Typography>

      <div className='detailsinput'>
        <InputField
          sx={{ m: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ContactMailIcon />
              </InputAdornment>
            ),
          }}
          id="input-email"
          name='email'
          value={data.email}
          autoComplete='off'
          label="EMAIL"
          type='email'
          disabled
          error={errors.email.length !== 0}
          helperText={errors.email}
        />

        <InputField
          sx={{ m: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ConfirmationNumberIcon />
              </InputAdornment>
            ),
          }}
          id="input-rollno"
          name='rollno'
          value={data.rollno}
          autoComplete='off'
          onChange={props.onChangeHandler}
          label="ROLL NO"
          error={errors.rollno.length !== 0}
          helperText={errors.rollno}
        />

        <InputField
          sx={{ m: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon />
              </InputAdornment>
            ),
          }}
          id="input-name"
          name='name'
          value={data.name}
          autoComplete='off'
          onChange={props.onChangeHandler}
          label="NAME"
          error={errors.name.length !== 0}
          helperText={errors.name}
        />
      </div>

      <div className='submitbutton'>
        <Button sx={{ m: 2 }} variant="outlined" size='large' endIcon={<NearMeIcon />} onClick={props.onSubmitHandler}>
          SAVE DETAILS
        </Button>
      </div>
    </div>
  );
};

export default Details;