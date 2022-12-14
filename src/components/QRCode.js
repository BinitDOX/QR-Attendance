import QRC from "react-qr-code";
import Typography from '@mui/material/Typography';

import './QRCode.css';

const QRCode = (props) => {
  console.log(props.uid);
  return (
    <div className='qrcode'>
      <Typography sx={{ m: 1 }} variant='h3' component='h3' align='center'>
        QR-CODE
      </Typography>
      <div style={{ background: 'black', padding: '16px', margin: '1rem'}}>
        <QRC
          size={256}
          bgColor=''
          fgColor='#ffd700'
          style={{ height: "auto", maxWidth: "20rem", width: "100%" }}
          value={props.uid}
          viewBox={`0 0 256 256`}
        />
      </div>
      
    </div>
  );
};

export default QRCode;