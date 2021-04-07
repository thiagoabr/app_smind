import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles
} from '@material-ui/core';
import api from '../../../utils/api';

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestOrders = ({ className, ...rest }) => {
  const classes = useStyles();
  const [pacients, setPacients] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const usuario = jwtDecode(localStorage.getItem('app_token'));
      const result = await api.get(`/paciente/${usuario.id}/last/8`);
      setPacients(result.data);
    };
    getData();
  }, []);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader title="Últimos cadastros de pacientes" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={250}>
          <Table>
            <TableHead>
              <TableRow />
            </TableHead>
            <TableBody>
              {pacients.map((pacient) => (
                <TableRow
                  hover
                  key={pacient.id}
                >
                  <TableCell>
                    {pacient.nome}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string
};

export default LatestOrders;
