import Modal from "@mui/material/Modal";
import LinearProgress from "@mui/material/LinearProgress";

const Loader = (props) => {
  return (
    <div>
      <Modal open={props.show}>
          <LinearProgress style={{ backgroundColor: '#d32f2f' }} />
      </Modal>
    </div>
  );
};

export default Loader;