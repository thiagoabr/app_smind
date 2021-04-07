// Próximas consultas
import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import 'moment/locale/pt-br';
import {
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles
} from '@material-ui/core';
import api from '../../../utils/api';

const useStyles = makeStyles(({
  root: {
    height: '100%'
  },
  image: {
    height: 48,
    width: 48
  }
}));

const LatestProducts = ({ className, ...rest }) => {
  const classes = useStyles();
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const usuario = jwtDecode(localStorage.getItem('app_token'));
      const result = await api.get(`/evento/${usuario.id}/next/limit/6`);
      setEventos(result.data);
    };
    getData();
  }, []);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardHeader subtitle={`${eventos.length} in total`} title="Próximas consultas" />
      <Divider />
      <List>
        {eventos.map((evento, i) => (
          <ListItem divider={i < eventos.length - 1} key={evento.id}>
            <ListItemText primary={evento.nome} secondary={moment(evento.dataInicioAtendimento).locale('pt-br').format('LLLL')} />
            <IconButton edge="end" size="small" />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string
};

export default LatestProducts;
