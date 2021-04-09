/* eslint-disable max-len */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Typography,
  makeStyles,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import jwt_decode from 'jwt-decode';
import api from '../../../utils/api';
import MessageDiaglog from '../../../components/MessageDialog';

const useStyles = makeStyles(({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  }
}));

const Notifications = ({ className, ...rest }) => {
  const defaultValues = {
    horaInicio: '',
    horaFim: '',
    intervalo: '',
    domingo: false,
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
    textoAgendamento: '',
    textoCancelamento: '',
    textoReagendamento: ''
  };
  const usuario = jwt_decode(localStorage.getItem('app_token'));

  const classes = useStyles();
  const [values, setValues] = useState(defaultValues);
  const childRef = useRef();
  const [intervalos] = useState(['60', '30']);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = async () => {
    await api.patch(`/configuracao/usuario/${usuario.id}`, { ...values });
    childRef.current.handleOpenMessage('Dados atualizados com sucesso!', 'success');
  };

  const getConfiguracao = async () => {
    const response = await api.get(`/configuracao/usuario/${usuario.id}`,);
    if (response.data.length === 0) {
      setValues(defaultValues);
    } else {
      setValues(response.data[0]);
    }
  };

  useEffect(() => {
    getConfiguracao();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Dados da sua agenda"
          title="Configurações"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              className={classes.item}
              item
              md={12}
            >
              <Typography color="textPrimary" gutterBottom variant="h6">
                Horário de atendimento
              </Typography>
              <Box component="div" display="inline">
                <TextField type="time" md={6} label="Início" name="horaInicio" value={values.horaInicio} required variant="outlined" onChange={handleChange} InputLabelProps={{ shrink: true }} />
                {' '}
                <TextField type="time" md={6} label="Fim" name="horaFim" value={values.horaFim} required variant="outlined" onChange={handleChange} InputLabelProps={{ shrink: true }} />
              </Box>
              <br />
              <Grid item md={3} xs={12}>
                <FormControl className={classes.formControl} fullWidth>
                  <InputLabel id="intervalo" shrink>Período de Atendimento</InputLabel>
                  <Select
                    name="intervalo"
                    onChange={handleChange}
                    value={values.intervalo}
                  >
                    {intervalos.map((item) => <MenuItem value={item}>{item}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Divider />
              <br />
              <Typography color="textPrimary" gutterBottom variant="h6">
                Dias de atendimento
              </Typography>
              <Box component="div" display="inline">
                <FormControlLabel control={(<Checkbox defaultChecked={values.domingo} checked={values.domingo} onChange={(e) => { setValues({ ...values, domingo: e.target.checked }); }} />)} label="Domingo" />
                <FormControlLabel control={(<Checkbox defaultChecked={values.segunda} checked={values.segunda} onChange={(e) => { setValues({ ...values, segunda: e.target.checked }); }} />)} label="Segunda" />
                <FormControlLabel control={(<Checkbox defaultChecked={values.terca} checked={values.terca} onChange={(e) => { setValues({ ...values, terca: e.target.checked }); }} />)} label="Terça" />
                <FormControlLabel control={(<Checkbox defaultChecked={values.quarta} checked={values.quarta} onChange={(e) => { setValues({ ...values, quarta: e.target.checked }); }} />)} label="Quarta" />
                <FormControlLabel control={(<Checkbox defaultChecked={values.quinta} checked={values.quinta} onChange={(e) => { setValues({ ...values, quinta: e.target.checked }); }} />)} label="Quinta" />
                <FormControlLabel control={(<Checkbox defaultChecked={values.sexta} checked={values.sexta} onChange={(e) => { setValues({ ...values, sexta: e.target.checked }); }} />)} label="Sexta" />
                <FormControlLabel control={(<Checkbox defaultChecked={values.sabado} checked={values.sabado} onChange={(e) => { setValues({ ...values, sabado: e.target.checked }); }} />)} label="Sábado" />
              </Box>
              <br />
              {/* <Typography color="textPrimary" gutterBottom variant="h6">Texto SMS Agendamento</Typography>
              <TextField placeholder="Máximo 150 caracteres" name="textoAgendamento" value={values.textoAgendamento} onChange={handleChange} multiline rows={3} />
              <br />
              <Typography color="textPrimary" gutterBottom variant="h6">Texto SMS Reagendamento</Typography>
              <TextField placeholder="Máximo 150 caracteres" name="textoReagendamento" value={values.textoReagendamento} onChange={handleChange} multiline rows={3} />
              <br />
              <Typography color="textPrimary" gutterBottom variant="h6">Texto SMS Cancelamento</Typography>
              <TextField placeholder="Máximo 150 caracteres" name="textoCancelamento" value={values.textoCancelamento} onChange={handleChange} multiline rows={3} /> */}
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" variant="contained" onClick={onSubmit}>Salvar</Button>
        </Box>
      </Card>
      <MessageDiaglog ref={childRef} />
    </form>
  );
};

Notifications.propTypes = {
  className: PropTypes.string
};

export default Notifications;
