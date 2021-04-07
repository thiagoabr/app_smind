/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Page from 'src/components/Page';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import MessageDiaglog from '../../components/MessageDialog';
import api from '../../utils/api';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <Link color="inherit" href="#">
        SMind
      </Link>
      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '50vh',
  },
  image: {
    backgroundImage: 'url(https://image.freepik.com/free-vector/tiny-people-beautiful-flower-garden-inside-female-head-isolated-flat-illustration_74855-11098.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',

  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundcolor: '#D8BFD8',
  },
  form: {
    width: '80%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),

  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#D8BFD8',
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const childRef = useRef();
  window.localStorage.clear();

  const responseGoogle = async (response) => {
    let jwt = null;
    console.log(response);
    await api.post('/loginGoogle', `{"login":"${response.profileObj.email}"}`,
      {
        headers: { 'Content-Type': 'application/json' },
        observe: 'response',
      },)
      .then((response) => {
        jwt = response.data.token;
        localStorage.setItem('app_token', jwt);
      })
      .catch((error) => {
        // childRef.current.handleOpenMessage('Usuário ou senha inválido(s)', 'error');
      });

    if (jwt) {
      navigate('/app/calendar', { replace: true });
    }
  };

  return (
    <Page className={classes.root} title="Login">
      <Grid container component="main">
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              SMind - Psicologia
            </Typography>

            <Formik
              initialValues={{
                email: '',
                senha: ''
              }}
              validationSchema={Yup.object().shape({
                email: Yup.string().email('Digite um e-mail válido').max(255).required('E-mail obrigatório'),
                senha: Yup.string().max(255).required('Senha é obrigatória')
              })}
              onSubmit={async (values) => {
                let jwt = null;
                await api.post('/login', `{"login":"${values.email}", "senha":"${values.senha}"}`, {
                  headers: { 'Content-Type': 'application/json' }
                }).then((response) => {
                  jwt = response.data.token;
                  localStorage.setItem('app_token', jwt);
                }).catch((error) => {
                  childRef.current.handleOpenMessage('Usuário ou senha inválido(s)', 'error');
                });

                if (jwt) {
                  navigate('/app/calendar', { replace: true });
                }
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

                <form className={classes.form} onSubmit={handleSubmit}>
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="E-mail"
                    margin="normal"
                    name="email"
                    variant="outlined"
                    id="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="email"
                    value={values.email}
                    required
                  />

                  <TextField
                    variant="outlined"
                    required
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    error={Boolean(touched.senha && errors.senha)}
                    fullWidth
                    helperText={touched.senha && errors.senha}
                    label="Senha"
                    margin="normal"
                    name="senha"
                    onChange={handleChange}
                    value={values.senha}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={isSubmitting}
                  >
                    Entrar
                  </Button>

                  <Grid container>
                    <Grid item xs>
                      <Link component={RouterLink} to="/forgot" variant="h6">
                        Esqueceu sua senha?
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link component={RouterLink} to="/register" variant="h6">
                        Não tem uma conta?
                      </Link>
                    </Grid>
                  </Grid>

                  <Box mt={3} mb={1}>
                    <Typography
                      align="center"
                      color="textSecondary"
                      variant="body1"
                    >
                      Ou faça login com Google
                    </Typography>
                  </Box>
                  <Grid
                    container
                    spacing={3}
                  >
                    <Grid item xs={12} md={12} align="center">
                      <GoogleLogin
                        fullWidth
                        clientId="379330882180-jh8ct3sg5gjo6t9e1p8tlfnpmqv6faj1.apps.googleusercontent.com"
                        buttonText="Login com Google"
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy="single_host_origin"
                      />
                    </Grid>
                  </Grid>
                  <Box mt={5}>
                    <Copyright />
                  </Box>
                </form>
              )}
            </Formik>
          </div>
        </Grid>
        <MessageDiaglog ref={childRef} />
      </Grid>
    </Page>
  );
};

export default LoginView;
