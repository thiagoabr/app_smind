/* eslint-disable no-shadow */
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const MessageDialog = forwardRef((props, ref) => {
  const [openMessage, setOpenMessage] = useState(false);
  const [typeMessage, setTypeMessage] = useState('success');
  const [message, setMessage] = useState('');

  function Alert(propsAlert) {
    return <MuiAlert elevation={6} variant="filled" {...propsAlert} />;
  }

  const handleCloseMessage = (reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenMessage(false);
  };

  useImperativeHandle(ref, () => ({

    handleOpenMessage(message, type) {
      setMessage(message);
      setTypeMessage(type);
      setOpenMessage(true);
    }

  }));

  return (
    <>
      <Snackbar open={openMessage} autoHideDuration={3000} onClose={handleCloseMessage} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseMessage} severity={typeMessage}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
});

export default MessageDialog;
