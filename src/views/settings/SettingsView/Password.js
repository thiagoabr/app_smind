import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles
} from '@material-ui/core';
import jwtDecode from 'jwt-decode';
import api from '../../../utils/api';
import MessageDiaglog from '../../../components/MessageDialog';

const useStyles = makeStyles(({
  root: {}
}));

const Password = ({ className, ...rest }) => {
  const usuario = jwtDecode(localStorage.getItem('app_token'));
  const classes = useStyles();
  const childRef = useRef();

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Atualizar Senha"
          title="Senha"
        />
        <Divider />
        <Formik
          initialValues={{
            senha: '',
            confirmaSenha: ''
          }}
          validationSchema={Yup.object().shape({
            senha: Yup.string().max(255).required('Senha é obrigatória'),
            confirmaSenha: Yup.string().required('Senha é obrigatória').oneOf([Yup.ref('senha'), null], 'As senhas são diferentes')
          })}
          onSubmit={async (values, { resetForm }) => {
            await api.post(`/usuario/senha/${usuario.id}`, { senha: values.senha });
            childRef.current.handleOpenMessage('Senha atualizada com sucesso!', 'success');
            resetForm({ values: '' });
          }}
        >
          {({
            errors,
            handleChange,
            handleSubmit,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <CardContent>
                <TextField
                  error={Boolean(touched.senha && errors.senha)}
                  fullWidth
                  helperText={touched.senha && errors.senha}
                  label="Senha"
                  margin="normal"
                  name="senha"
                  onChange={handleChange}
                  type="password"
                  value={values.senha}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.confirmaSenha && errors.confirmaSenha)}
                  fullWidth
                  helperText={touched.confirmaSenha && errors.confirmaSenha}
                  label="Confirmar senha"
                  margin="normal"
                  name="confirmaSenha"
                  onChange={handleChange}
                  type="password"
                  value={values.confirmaSenha}
                  variant="outlined"
                />
              </CardContent>
              <Divider />
              <Box
                display="flex"
                justifyContent="flex-end"
                p={2}
              >
                <Button color="primary" variant="contained" type="submit">Atualizar</Button>
              </Box>
            </form>
          )}
        </Formik>
      </Card>
      <MessageDiaglog ref={childRef} />
    </form>
  );
};

Password.propTypes = {
  className: PropTypes.string
};

export default Password;
