/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable max-classes-per-file */
import * as React from 'react';
import jwtDecode from 'jwt-decode';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Toolbar,
  DayView,
  MonthView,
  WeekView,
  ViewSwitcher,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  EditRecurrenceMenu,
  DateNavigator,
  TodayButton
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles } from '@material-ui/core/styles';
import {
  Add as AddIcon,
  Search,
  Close,
  ContactPhone,
  AddCircleOutline
} from '@material-ui/icons';
import {
  FormControl,
  InputLabel,
  Dialog,
  TextField,
  Select,
  CardHeader,
  Container,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  IconButton,
  MenuItem
} from '@material-ui/core';
import { connectProps } from '@devexpress/dx-react-core';
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import Grid from '@material-ui/core/Grid';

import Page from 'src/components/Page';
import api from '../../../utils/api';

const containerStyles = (theme) => ({
  container: {
    width: theme.spacing(68),
    padding: 0,
    paddingBottom: theme.spacing(2),
  },
  content: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  header: {
    overflow: 'hidden',
    paddingTop: theme.spacing(0.5),
  },
  closeButton: {
    float: 'right',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 2),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  picker: {
    marginRight: theme.spacing(2),
    '&:last-child': {
      marginRight: 0,
    },
    width: '50%',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
  },
  icon: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(2),
    cursor: 'pointer'
  },
  textField: {
    width: '100%',
  },
});

class AppointmentFormContainerBasic extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      appointmentChanges: {},
      listTipoConsulta: []
    };

    this.getAppointmentData = () => {
      const { appointmentData } = this.props;
      return appointmentData;
    };
    this.getAppointmentChanges = () => {
      const { appointmentChanges } = this.state;
      return appointmentChanges;
    };

    this.changeAppointment = this.changeAppointment.bind(this);
    this.commitAppointment = this.commitAppointment.bind(this);
    api.get('/tipoConsulta').then((response) => this.setState({ listTipoConsulta: response.data }));
  }

  changeAppointment({ field, changes }) {
    const nextChanges = {
      ...this.getAppointmentChanges(),
      [field]: changes,
    };
    this.setState({
      appointmentChanges: nextChanges,
    });
  }

  async commitAppointment(type) {
    const { commitChanges } = this.props;
    const appointment = {
      ...this.getAppointmentData(),
      ...this.getAppointmentChanges(),
    };
    const usuario = jwtDecode(localStorage.getItem('app_token'));

    const param = {
      id: null,
      usuarioId: usuario.id,
      tipoEventoId: appointment.tipoConsultaId,
      pacienteId: appointment.pacienteId,
      situacaoEventoId: 1, // Criado
      nome: appointment.paciente,
      cpf: appointment.cpf,
      dataInicioAtendimento: appointment.startDate,
      dataFimAtendimento: appointment.endDate,
      telefone: appointment.telefone,
      observacao: appointment.observacao
    };

    appointment.title = appointment.paciente.split(' ').length > 1 ? `${appointment.paciente.split(' ')[0]} ${appointment.paciente.split(' ')[1]}` : appointment.paciente;
    appointment.tipoProcedimento = appointment.tipoConsultaId === 1 ? 'Agendamento'
      : appointment.tipoConsultaId === 2 ? 'Reagendamento' : '';

    if (type === 'changed' || type === 'deleted') {
      if (type === 'changed') {
        param.situacaoEventoId = 2;
      } else {
        param.situacaoEventoId = 3;
      }
      // Realizando a persistência
      param.id = appointment.id;
      await api.patch(`/evento/${appointment.id}`, param);

      commitChanges({ [type]: { [appointment.id]: appointment } });
    } else {
      const response = await api.post('/evento/', param);
      appointment.id = response.data.id;

      commitChanges({ [type]: appointment });
    }

    this.setState({
      appointmentChanges: {},
    });
  }

  render() {
    const {
      classes,
      visible,
      visibleChange,
      appointmentData,
      cancelAppointment,
      target,
      onHide,
    } = this.props;
    const { appointmentChanges, listTipoConsulta } = this.state;

    const displayAppointmentData = {
      ...appointmentData,
      ...appointmentChanges,
    };

    const isNewAppointment = appointmentData.id === undefined;
    const applyChanges = isNewAppointment
      ? () => this.commitAppointment('added')
      : () => this.commitAppointment('changed');

    const textEditorProps = (field, name) => ({
      variant: 'outlined',
      onChange: ({ target: change }) => this.changeAppointment({
        field: [field], changes: change.value,
      }),
      value: displayAppointmentData[field] || '',
      label: name,
      name: field,
      className: classes.textField,
    });

    const searchPaciente = async () => {
      const cpf = displayAppointmentData.cpf;
      const usuario = jwtDecode(localStorage.getItem('app_token'));

      const result = await api.get(`/paciente/usuario/${usuario.id}/cpf/${cpf}`);
      if (result.data !== '') {
        const { id, nome, telefone } = result.data;

        this.changeAppointment({ field: 'paciente', changes: nome });
        this.changeAppointment({ field: 'pacienteId', changes: id });
        this.changeAppointment({ field: 'telefone', changes: telefone });
      }
    };

    const pickerEditorProps = (field) => ({
      className: classes.picker,
      ampm: false,
      value: displayAppointmentData[field],
      onChange: (date) => this.changeAppointment({
        field: [field], changes: date ? date.toDate() : new Date(displayAppointmentData[field]),
      }),
      inputVariant: 'outlined',
      format: 'DD/MM/YYYY HH:mm',
      onError: () => null,
    });

    const cancelChanges = () => {
      this.setState({
        appointmentChanges: {},
      });
      visibleChange();
      cancelAppointment();
    };

    return (
      <AppointmentForm.Overlay visible={visible} target={target} fullSize onHide={onHide}>
        <div>
          <div className={classes.header}>
            <IconButton className={classes.closeButton} onClick={cancelChanges}>
              <Close color="action" />
            </IconButton>
            <CardHeader title="Dados da Consulta" />
          </div>
          <div className={classes.content}>
            <div className={classes.wrapper}>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel id="tipoConsultaId">&nbsp;&nbsp;&nbsp;Tipo Consulta</InputLabel>
                <Select labelId="tipoConsultaId" {...textEditorProps('tipoConsultaId', 'Tipo Consulta')}>
                  {listTipoConsulta.map((item) => <MenuItem value={item.id}>{item.descricao}</MenuItem>)}
                </Select>
              </FormControl>
            </div>
            <div className={classes.wrapper}>
              <TextField
                {...textEditorProps('cpf', 'C.P.F.')}
              />
              {' '}
&nbsp;
              {' '}
&nbsp;
              <Search className={classes.icon} color="action" onClick={searchPaciente} />
              <TextField style={{ display: 'none' }} {...textEditorProps('pacienteId', 'pacienteId')} />
            </div>
            <div className={classes.wrapper}>
              <TextField {...textEditorProps('paciente', 'Paciente')} />
            </div>
            <div className={classes.wrapper}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDateTimePicker label="Data Início" {...pickerEditorProps('startDate')} />
                <KeyboardDateTimePicker label="Data Fim" {...pickerEditorProps('endDate')} />
              </MuiPickersUtilsProvider>
            </div>
            <div className={classes.wrapper}>
              <TextField {...textEditorProps('telefone', 'Telefone')} />
            </div>
            <div className={classes.wrapper}>
              <TextField {...textEditorProps('observacao', 'Observação')} multiline rows="4" />
            </div>
          </div>
          <div className={classes.buttonGroup}>
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => {
                visibleChange();
                applyChanges();
              }}
            >
              {isNewAppointment ? 'Novo' : 'Salvar'}
            </Button>
          </div>
        </div>
      </AppointmentForm.Overlay>
    );
  }
}

const AppointmentFormContainer = withStyles(containerStyles, { name: 'AppointmentFormContainer' })(AppointmentFormContainerBasic);

const styles = (theme) => ({
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(1) * 3,
    right: theme.spacing(1) * 4,
  },
});

/* eslint-disable-next-line react/no-multi-comp */
class Calendar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [], // appointments,
      currentDate: new Date(),
      confirmationVisible: false,
      editingFormVisible: false,
      deletedAppointmentId: undefined,
      editingAppointment: undefined,
      previousAppointment: undefined,
      addedAppointment: {},
      startDayHour: 9,
      endDayHour: 19,
      interval: 30,
      isNewAppointment: false,
    };

    this.toggleConfirmationVisible = this.toggleConfirmationVisible.bind(this);
    this.commitDeletedAppointment = this.commitDeletedAppointment.bind(this);
    this.toggleEditingFormVisibility = this.toggleEditingFormVisibility.bind(this);

    this.commitChanges = this.commitChanges.bind(this);
    this.onEditingAppointmentChange = this.onEditingAppointmentChange.bind(this);
    this.onAddedAppointmentChange = this.onAddedAppointmentChange.bind(this);
    this.currentDateChange = (currentDate) => { this.setState({ currentDate }); };
    this.appointmentForm = connectProps(AppointmentFormContainer, () => {
      const {
        editingFormVisible,
        editingAppointment,
        data,
        addedAppointment,
        isNewAppointment,
        previousAppointment,
      } = this.state;

      const currentAppointment = data
        .filter((appointment) => editingAppointment && appointment.id === editingAppointment.id)[0]
        || addedAppointment;
      const cancelAppointment = () => {
        if (isNewAppointment) {
          this.setState({
            editingAppointment: previousAppointment,
            isNewAppointment: false,
          });
        }
      };

      return {
        visible: editingFormVisible,
        appointmentData: currentAppointment,
        commitChanges: this.commitChanges,
        visibleChange: this.toggleEditingFormVisibility,
        onEditingAppointmentChange: this.onEditingAppointmentChange,
        cancelAppointment,
      };
    });
  }

  componentDidUpdate() {
    this.appointmentForm.update();
  }

  async componentDidMount() {
    const usuario = jwtDecode(localStorage.getItem('app_token'));

    const getLastDate = (startDate, weeksBack) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() - d.getDay() + weeksBack);
      return new Date(d);
    };

    const formatDate = (date) => {
      const d = new Date(date);
      let month = `${d.getMonth() + 1}`;
      let day = `${d.getDate()}`;
      const year = d.getFullYear();

      if (month.length < 2) { month = `0${month}`; }
      if (day.length < 2) { day = `0${day}`; }

      return [year, month, day].join('-');
    };

    const returnDayBlock = (beginHour, endHour, weekDay) => {
      return {
        title: 'Horário Bloqueado',
        startDate: getLastDate(new Date(`${formatDate(this.state.currentDate)} ${beginHour}:00`), weekDay),
        endDate: getLastDate(new Date(`${formatDate(this.state.currentDate)} ${endHour}:00`), weekDay),
        tipoEventoId: 4
      };
    };

    let usuarioConfig;
    const result = await api.get(`/configuracao/usuario/${usuario.id}`);

    if (result.data.length > 0) {
      usuarioConfig = result.data[0];
      this.setState({
        startDayHour: parseInt(usuarioConfig.horaInicio.split(':')[0]),
        endDayHour: parseInt(usuarioConfig.horaFim.split(':')[0]),
        interval: parseInt(usuarioConfig.intervalo)
      });
    }

    await api.get(`/evento/${usuario.id}`).then((response) => {
      const data = response.data.map((appointment) => ({
        ...appointment,
        title: appointment.nome.split(' ').length > 1 ? `${appointment.nome.split(' ')[0]} ${appointment.nome.split(' ')[1]}`
          : appointment.nome.split(' ')[0],
        paciente: appointment.nome,
        tipoProcedimento: appointment.tipoEventoId === 1 ? 'Agendamento'
          : appointment.tipoEventoId === 2 ? 'Reagendamento' : '',
        startDate: appointment.dataInicioAtendimento,
        endDate: appointment.dataFimAtendimento,
        tipoConsultaId: appointment.tipoEventoId
      }));

      // Adicionando hrários bloqueados
      if (!usuarioConfig.domingo) {
        data.push(returnDayBlock(usuarioConfig.horaInicio, usuarioConfig.horaFim, 0));
      }

      if (!usuarioConfig.segunda) {
        data.push(returnDayBlock(usuarioConfig.horaInicio, usuarioConfig.horaFim, 1));
      }

      if (!usuarioConfig.terca) {
        data.push(returnDayBlock(usuarioConfig.horaInicio, usuarioConfig.horaFim, 2));
      }

      if (!usuarioConfig.quarta) {
        data.push(returnDayBlock(usuarioConfig.horaInicio, usuarioConfig.horaFim, 3));
      }

      if (!usuarioConfig.quinta) {
        data.push(returnDayBlock(usuarioConfig.horaInicio, usuarioConfig.horaFim, 4));
      }

      if (!usuarioConfig.sexta) {
        data.push(returnDayBlock(usuarioConfig.horaInicio, usuarioConfig.horaFim, 5));
      }

      if (!usuarioConfig.sabado) {
        data.push(returnDayBlock(usuarioConfig.horaInicio, usuarioConfig.horaFim, 6));
      }

      this.setState({ data });
    });
  }

  onEditingAppointmentChange(editingAppointment) {
    this.setState({ editingAppointment });
  }

  onAddedAppointmentChange(addedAppointment) {
    this.setState({ addedAppointment });
    const { editingAppointment } = this.state;
    if (editingAppointment !== undefined) {
      this.setState({
        previousAppointment: editingAppointment,
      });
    }
    this.setState({ editingAppointment: undefined, isNewAppointment: true });
  }

  setDeletedAppointmentId(id) {
    this.setState({ deletedAppointmentId: id });
  }

  toggleEditingFormVisibility() {
    const { editingFormVisible } = this.state;
    this.setState({
      editingFormVisible: !editingFormVisible,
    });
  }

  toggleConfirmationVisible() {
    const { confirmationVisible } = this.state;
    this.setState({ confirmationVisible: !confirmationVisible });
  }

  commitDeletedAppointment() {
    this.setState((state) => {
      const { data, deletedAppointmentId } = state;

      const upateState = async () => {
        const app = data.filter((appointment) => appointment.id === deletedAppointmentId)[0];
        const param = {
          id: app.id,
          tipoEventoId: app.tipoConsultaId,
          pacienteId: app.pacienteId,
          situacaoEventoId: 3, // Excluído
          nome: app.paciente,
          cpf: app.cpf,
          dataInicioAtendimento: app.startDate,
          dataFimAtendimento: app.endDate,
          telefone: app.telefone,
          observacao: app.observacao
        };
        // Realizando a persistência
        await api.patch(`/evento/${app.id}`, param);
      };

      upateState();

      const nextData = data.filter((appointment) => appointment.id !== deletedAppointmentId);

      return { data: nextData, deletedAppointmentId: null };
    });
    this.toggleConfirmationVisible();
  }

  commitChanges({ added, changed, deleted }) {
    this.setState((state) => {
      let { data } = state;
      if (added) {
        data = [...data, { ...added }];
      }
      if (changed) {
        data = data.map((appointment) => (
          changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
      }
      if (deleted !== undefined) {
        this.setDeletedAppointmentId(deleted);
        this.toggleConfirmationVisible();
      }
      return { data, addedAppointment: {} };
    });
  }

  render() {
    const {
      currentDate,
      data,
      confirmationVisible,
      editingFormVisible,
      startDayHour,
      endDayHour,
      interval
    } = this.state;
    const { classes } = this.props;

    const Content = withStyles({ name: 'Content' })(({
      children, appointmentData, classes, ...restProps
    }) => (
      <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        <Grid container alignItems="center">
          <Grid item xs={2} className="tooltip-icon">
            <AddCircleOutline className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <span>{appointmentData.tipoProcedimento}</span>
          </Grid>
        </Grid>
        <Grid container alignItems="center">
          <Grid item xs={2} className="tooltip-icon">
            <ContactPhone className={classes.icon} />
          </Grid>
          <Grid item xs={10}>
            <span>{appointmentData.telefone}</span>
          </Grid>
        </Grid>
        <Grid container alignItems="right">
          <Grid item xs={2} className="tooltip-icon">
            Obs.:
          </Grid>
          <Grid item xs={10}>
            <span>{appointmentData.observacao}</span>
          </Grid>
        </Grid>
      </AppointmentTooltip.Content>
    ));

    return (
      <Page className={classes.root} title="SMind">
        <br />
        <br />
        <br />

        <Container maxWidth="xl">
          <Paper>
            <Scheduler data={data} locale="pt-BR">
              <ViewState
                currentDate={currentDate}
                defaultCurrentViewName="Week"
                onCurrentDateChange={this.currentDateChange}
              />
              <EditingState
                onCommitChanges={this.commitChanges}
                onEditingAppointmentChange={this.onEditingAppointmentChange}
                onAddedAppointmentChange={this.onAddedAppointmentChange}
              />
              <DayView
                displayName="Dia"
                startDayHour={startDayHour}
                endDayHour={endDayHour}
                cellDuration={interval}
              />
              <WeekView
                displayName="Semana"
                startDayHour={startDayHour}
                endDayHour={endDayHour}
                cellDuration={interval}
              />
              <MonthView displayName="Mês" />
              <Toolbar />
              <DateNavigator />
              <TodayButton displayName="Hoje" />
              <EditRecurrenceMenu />
              <Appointments />
              <AppointmentTooltip
                contentComponent={Content}
                showOpenButton
                showCloseButton
                showDeleteButton
              />

              <ViewSwitcher />
              <AppointmentForm
                overlayComponent={this.appointmentForm}
                visible={editingFormVisible}
                onVisibilityChange={this.toggleEditingFormVisibility}
              />
            </Scheduler>

            <Dialog open={confirmationVisible} onClose={this.cancelDelete}>
              <DialogTitle>
                Deletar uma consulta
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Tem certeza que deseja deletar essa consulta?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.toggleConfirmationVisible} color="primary" variant="outlined">
                  Cancelar
                </Button>
                <Button onClick={this.commitDeletedAppointment} color="secondary" variant="outlined">
                  Deletar
                </Button>
              </DialogActions>
            </Dialog>

            <Fab
              color="secondary"
              className={classes.addButton}
              onClick={() => {
                this.setState({ editingFormVisible: true });
                this.onEditingAppointmentChange(undefined);
                this.onAddedAppointmentChange({
                  startDate: new Date(currentDate).setHours(startDayHour),
                  endDate: new Date(currentDate).setHours(startDayHour + 1),
                });
              }}
            >
              <AddIcon />
            </Fab>
          </Paper>
        </Container>
        <br />
        <br />
        <br />
      </Page>
    );
  }
}

export default withStyles(styles, { name: 'SMind' })(Calendar);
