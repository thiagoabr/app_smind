import React from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Notifications from './Notifications';
import Password from './Password';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#E6E6FA',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const SettingsView = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Configurações">
      <Container maxWidth="lg">
        <Notifications />
        <Box mt={3}>
          <Password />
        </Box>
      </Container>
    </Page>
  );
};

export default SettingsView;