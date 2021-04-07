/* eslint-disable max-len */
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
import ProfileDetails from './Details';
import api from '../../../utils/api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#E6E6FA',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ApproachType = () => {
  const classes = useStyles();
  const [approachTypes, setApproachTypes] = useState([{}]);
  const childRef = useRef();

  const getTipoAbordagem = async () => {
    const response = await api.get('/tipoAbordagem');
    setApproachTypes(response.data);
  };

  useEffect(() => {
    getTipoAbordagem();
  });

  const onResetForm = () => {
    childRef.current.handleResetForm();
  };

  const OnEdit = (values) => {
    childRef.current.handleSetValues(values);
  };

  return (
    <Page className={classes.root} title="Tipo de Abordagem">
      <Container maxWidth="lg">
        <Box display="flex">
          <Button color="primary" variant="contained" onClick={onResetForm}>Adicionar Abordagem</Button>
        </Box>
        <br />
        <Grid container spacing={3}>
          <Grid item lg={6} md={6} xs={12}>
            <ProfileDetails ref={childRef} getTipoAbordagem={getTipoAbordagem} />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Results approachTypes={approachTypes} onEdit={OnEdit} getTipoAbordagem={getTipoAbordagem} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ApproachType;
