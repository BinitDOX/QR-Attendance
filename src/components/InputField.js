import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

import './InputField.css';

const InputField = (props) => {
  return (
    <div className='inputfield'>
      <CSSTextField {...props} />
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

export default InputField;