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

const ConsultationType = () => {
  const classes = useStyles();
  const [consultationTypes, setConsultationTypes] = useState([]);
  const childRef = useRef();

  const getTipoConsulta = async () => {
    const response = await api.get('/tipoConsulta');
    setConsultationTypes(response.data);
  };

  useEffect(() => {
    getTipoConsulta();
  });

  const onResetForm = () => {
    childRef.current.handleResetForm();
  };

  const OnEdit = (values) => {
    childRef.current.handleSetValues(values);
  };

  return (
    <Page className={classes.root} title="Tipo de Consulta">
      <Container maxWidth="lg">
        <Box display="flex">
          <Button color="primary" variant="contained" onClick={onResetForm}>Adicionar Tipo Consulta</Button>
        </Box>
        <br />
        <Grid container spacing={3}>
          <Grid item lg={6} md={6} xs={12}>
            <ProfileDetails ref={childRef} getTipoConsulta={getTipoConsulta} />
          </Grid>
          <Grid item lg={6} md={6} xs={12}>
            <Results consultationTypes={consultationTypes} onEdit={OnEdit} getTipoConsulta={getTipoConsulta} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ConsultationType;
