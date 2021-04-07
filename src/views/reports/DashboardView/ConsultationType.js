/* eslint-disable no-mixed-operators */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  colors,
  makeStyles,
  useTheme
} from '@material-ui/core';
import api from '../../../utils/api';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  }
}));

const ConsultationType = ({ className, ...rest }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [types, setTypes] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalAg, setTotalAg] = useState(0);
  const [totalRe, setTotalRe] = useState(0);
  const [totalCa, setTotalCa] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const usuario = jwtDecode(localStorage.getItem('app_token'));
      const result = await api.get(`/evento/${usuario.id}/pct`);
      setTypes(result.data);
      setTotal(result.data.map((x) => x.total).reduce((a, b) => a + b, 0));
      setTotalAg(result.data.filter((x) => x.tipo_evento_id === 1).length === 0 ? 0 : result.data.filter((x) => x.tipo_evento_id === 1)[0].total);
      setTotalRe(result.data.filter((x) => x.tipo_evento_id === 2).length === 0 ? 0 : result.data.filter((x) => x.tipo_evento_id === 2)[0].total);
      setTotalCa(result.data.filter((x) => x.tipo_evento_id === 3).length === 0 ? 0 : result.data.filter((x) => x.tipo_evento_id === 3)[0].total);
    };
    getData();
  }, []);

  const data = {
    datasets: [
      {
        data: types.map((x) => x.total),
        backgroundColor: [
          colors.indigo[500],
          colors.orange[600],
          colors.red[600]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: ['Agendamentos', 'Reagendamentos', 'Cancelamentos']
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.default,
      bodyFontColor: '#E6E6FA',
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const devices = [
    {
      title: 'Agendamentos',
      value: totalAg === 0 ? 0 : Math.round(totalAg / total * 100),
      color: colors.indigo[500]
    },
    {
      title: 'Reagendamentos',
      value: totalRe === 0 ? 0 : Math.round(totalRe / total * 100),
      color: colors.orange[900]
    },
    {
      title: 'Cancelamentos',
      value: totalCa === 0 ? 0 : Math.round(totalCa / total * 100),
      color: colors.red[600]
    }
  ];

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Agendamentos X Reagendamentos X Cancelamentos" />
      <Divider />
      <CardContent>
        <Box
          height={300}
          position="relative"
        >
          <Doughnut
            data={data}
            options={options}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          mt={2}
        >
          {devices.map(({
            color,
            title,
            value
          }) => (
            <Box
              key={title}
              p={1}
              textAlign="center"
            >
              <Typography
                color="textPrimary"
                variant="body1"
              >
                {title}
              </Typography>
              <Typography
                style={{ color }}
                variant="h2"
              >
                {value}
                %
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

ConsultationType.propTypes = {
  className: PropTypes.string
};

export default ConsultationType;
