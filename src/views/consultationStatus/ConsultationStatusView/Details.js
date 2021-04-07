/* eslint-disable no-shadow */
import React, {
  useState, useRef, useImperativeHandle, forwardRef
} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles
} from '@material-ui/core';
import api from '../../../utils/api';
import MessageDiaglog from '../../../components/MessageDialog';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = forwardRef(({ className, getSituacaoConsulta, ...rest }, ref) => {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const childRef = useRef();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSubmit = async () => {
    if (values.id === undefined) {
      await api.post('/situacaoConsulta', values);
      childRef.current.handleOpenMessage('Situação da Consulta cadastrada com sucesso!', 'success');
    } else {
      await api.patch(`/situacaoConsulta/${values.id}`, values);
      childRef.current.handleOpenMessage('Situação da Consulta atualizada com sucesso!', 'success');
    }
    getSituacaoConsulta();
    setValues({ descricao: '' });
  };

  useImperativeHandle(ref, () => ({

    handleResetForm() {
      setValues({ descricao: '' });
    },
    handleSetValues(values) {
      setValues({
        ...values,
      });
    }

  }));

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader title="Cadastro de Situação de Consulta" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField fullWidth label="Descrição" name="descricao" onChange={handleChange} required value={values.descricao} variant="outlined" inputRef={(input) => input && input.focus()} />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box display="flex" justifyContent="flex-start" p={2} />
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button color="primary" variant="contained" onClick={onSubmit}>Salvar</Button>
        </Box>
      </Card>
      <MessageDiaglog ref={childRef} />
    </form>
  );
});

ProfileDetails.propTypes = {
  className: PropTypes.string,
  getSituacaoConsulta: PropTypes.func
};

export default ProfileDetails;
