import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Details from './Details';
import api from '../../../utils/api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#E6E6FA',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const User = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const childRef = useRef();

  const getUsers = async () => {
    const response = await api.get('/usuario');
    setUsers(response.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const onResetForm = () => {
    childRef.current.handleResetForm();
  };

  const OnEdit = (values) => {
    values.senha = '';
    childRef.current.handleSetValues(values);
  };

  return (
    <Page className={classes.root} title="Usuário">
      <Container maxWidth="xl">
        <Box display="flex">
          <Button color="primary" variant="contained" onClick={onResetForm}>Adicionar Usuário</Button>
        </Box>
        <br />
        <Grid container spacing={3}>
          <Grid item lg={5} md={5} xs={12}>
            <Details ref={childRef} getUsers={getUsers} />
          </Grid>
          <Grid item lg={7} md={7} xs={12}>
            <Results users={users} onEdit={OnEdit} getUsers={getUsers} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default User;
