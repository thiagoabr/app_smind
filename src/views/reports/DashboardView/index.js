import React from 'react';
import {
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import LatestOrders from './LatestOrders';
import NextConsultation from './NextConsultation';
import ConsultationsPerMonth from './ConsultationsPerMonth';
import ConsultationType from './ConsultationType';
import QtdPacients from './QtdPacients';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#E6E6FA',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <ConsultationsPerMonth />
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth={false}>
        <Grid container spacing={4}>
          <Grid item lg={12} md={12} xl={6} xs={12}>
            <QtdPacients />
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={5} md={7} xl={4} xs={12}>
            <ConsultationType />
          </Grid>
          <Grid item lg={4} md={5} xl={5} xs={12}>
            <NextConsultation />
          </Grid>
          <Grid item lg={3} md={3} xl={3} xs={12}>
            <LatestOrders />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
