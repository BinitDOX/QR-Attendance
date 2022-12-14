import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import InputAdornment from '@mui/material/InputAdornment';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NearMeIcon from '@mui/icons-material/NearMe';

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
        <CSSTextField
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

        <CSSTextField
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

        <CSSTextField
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


const CSSTextField = styled(TextField)({
  '& .MuiInputBase-input': {
      color: 'white',
  },
  '& label': {
      color: '#ffdb1b'
  },
  '& label.Mui-focused': {
      color: 'white',
  },
  '& .MuiInput-underline:after': {
      borderBottomColor: '#ffdb1b',
  },
  '& .MuiOutlinedInput-root': {
      '& fieldset': {
          borderColor: '#666666',
      },
      '&:hover fieldset': {
          borderColor: '#ffdb1b',
      },
      '&.Mui-focused fieldset': {
          borderColor: '#ffdb1b',
      },
  },

  "& .MuiFormLabel-root.Mui-error": {
      color: "#d32f2f !important"
  },
  '& label.Mui-focused.Mui-error': {
      color: "white !important",
  },
  '& .MuiOutlinedInput-root.Mui-error': {
      '& fieldset': {
          borderColor: "#d32f2f !important",
      },
      '&:hover fieldset': {
          borderColor: "#d32f2f !important",
      },
      '&.Mui-focused fieldset': {
          borderColor: "#d32f2f !important",
      },
  },

  '& .MuiInputBase-input.Mui-disabled': {
      color: 'white',
      cursor: 'not-allowed'
  },
  "& .MuiFormLabel-root.Mui-disabled": {
      color: "#ffdb1b !important"
  },
  '& label.Mui-focused.Mui-disabled': {
      color: "white !important",
  },
  '& .MuiOutlinedInput-root.Mui-disabled': {
      '& fieldset': {
          borderColor: "#ffdb1b !important",
      },
      '&:hover fieldset': {
          borderColor: "#ffdb1b !important",
      },
      '&.Mui-focused fieldset': {
          borderColor: "#ffdb1b !important",
      },
  },
});

export default Details;