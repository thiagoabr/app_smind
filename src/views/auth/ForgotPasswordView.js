import React, { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import MessageDiaglog from '../../components/MessageDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#E6E6FA',
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ForgotPasswordView = () => {
  const classes = useStyles();
  const childRef = useRef();

  const onSubmit = () => {
    childRef.current.handleOpenMessage('E-mail de recuperação de senha foi enviado com sucesso para seu e-mail!', 'success');
  };

  return (
    <Page className={classes.root} title="Esqueceu sua senha">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              password: '',
              policy: false
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('E-mail inválido').max(255).required('Email é obrigatório')
              })
            }
            onSubmit={(values, { resetForm }) => {
              onSubmit();
              resetForm({ values: '' });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Esqueceu sua senha?
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Insira seu e-mail para recuperar
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="E-mail"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Recuperar
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Tem uma conta?
                  {' '}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Entre agora
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
      <MessageDiaglog ref={childRef} />
    </Page>
  );
};

export default ForgotPasswordView;
