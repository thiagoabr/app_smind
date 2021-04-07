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
import MessageDiaglog from '../../../components/MessageDialog';
import api from '../../../utils/api';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = forwardRef(({ className, getTipoAbordagem, ...rest }, ref) => {
  const classes = useStyles();
  const [values, setValues] = useState({});
  const childRef = useRef();

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  useImperativeHandle(ref, () => ({

    handleResetForm() {
      setValues({ descricao: '' });
    },
    handleSetValues(values) {
      setValues({
        ...values,
        [values.name]: values.value
      });
    }

  }));

  const onSubmit = async () => {
    if (values.id === undefined) {
      await api.post('/tipoAbordagem', values);
      childRef.current.handleOpenMessage('Tipo de Abordagem cadastrado com sucesso!', 'success');
    } else {
      await api.patch(`/tipoAbordagem/${values.id}`, values);
      childRef.current.handleOpenMessage('Tipo de Abordagem atualizado com sucesso!', 'success');
    }
    getTipoAbordagem();
    setValues({ descricao: '' });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader title="Cadastro do Tipo de Abordagem" />
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
  getTipoAbordagem: PropTypes.func
};

export default ProfileDetails;
