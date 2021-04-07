/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  CardContent,
  Card,
  CardHeader,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  IconButton
} from '@material-ui/core';
import {
  Delete as DeleteIcon, Edit as EditIcon,
  Archive
} from '@material-ui/icons';
import { CSVLink } from 'react-csv';
import MessageDiaglog from '../../../components/MessageDialog';
import AlertDialog from '../../../components/AlertDialog';
import api from '../../../utils/api';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0)
  },
  icon: {
    margin: theme.spacing(2, 0),
    marginRight: theme.spacing(2),
    cursor: 'pointer'
  }
}));

const Results = ({
  className, pacients, onEdit, getPacientes, ...rest
}) => {
  const classes = useStyles();
  const [selectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const childRef = useRef();
  const chilRefAlert = useRef();
  const [pacientId, setPacientId] = useState(0);

  const headers = [
    { label: 'Nome', key: 'nome' },
    { label: 'C.P.F.', key: 'cpf' },
    { label: 'Data de Nascimento', key: 'dataNascimento' },
    { label: 'Sexo', key: 'sexo' },
    { label: 'E-mail', key: 'email' },
    { label: 'Telefone', key: 'telefone' }
  ];

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleConfirm = async (id) => {
    setPacientId(id);
    chilRefAlert.current.handleClickOpen();
  };

  const handleDelete = async (id) => {
    await api.delete(`/paciente/${id}`);
    childRef.current.handleOpenMessage('Paciente deletado com sucesso!', 'success');
    getPacientes();
  };

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader title="Lista de Pacientes" />
        <Divider />
        <PerfectScrollbar>
          <Box display="flex" justifyContent="flex-end">
            <div className={classes.wrapper}>
              <CSVLink className={classes.icon} color="action" data={pacients} headers={headers} separator=";"><Archive /></CSVLink>
            </div>
          </Box>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>E-mail</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {pacients.slice(page * limit, page * limit + limit).map((pacient) => (
                  <TableRow hover key={pacient.id} selected={selectedCustomerIds.indexOf(pacient.id) !== -1}>
                    <TableCell>{pacient.nome}</TableCell>
                    <TableCell>{pacient.email}</TableCell>
                    <TableCell>{pacient.cpf}</TableCell>
                    <TableCell align="right" width="30%">
                      <IconButton onClick={() => onEdit(pacient)}><EditIcon color="primary" /></IconButton>
                      |
                      <IconButton
                        onClick={() => handleConfirm(pacient.id)}
                      >
                        <DeleteIcon color="secondary" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={pacients.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <MessageDiaglog ref={childRef} />
      <AlertDialog ref={chilRefAlert} handleConfirm={() => handleDelete(pacientId)} />
    </>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  pacients: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  getSPacientes: PropTypes.func
};

export default Results;
