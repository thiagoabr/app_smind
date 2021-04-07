/* eslint-disable max-len */
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
import api from '../../../utils/api';
import AlertDialog from '../../../components/AlertDialog';

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
  className, consultationStatus, onEdit, getSituacaoConsulta, ...rest
}) => {
  const classes = useStyles();
  const [selectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const childRef = useRef();
  const chilRefAlert = useRef();
  const [consultationStatusId, setConsultationStatusId] = useState(0);

  const headers = [
    { label: 'Descrição', key: 'descricao' }
  ];

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleConfirm = async (id) => {
    setConsultationStatusId(id);
    chilRefAlert.current.handleClickOpen();
  };

  const handleDelete = async (id) => {
    await api.delete(`/situacaoConsulta/${id}`);
    childRef.current.handleOpenMessage('Situação da Consulta deletada com sucesso!', 'success');
    getSituacaoConsulta();
  };

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader title="Lista de Situação de Consulta" />
        <Divider />
        <PerfectScrollbar>
          <Box display="flex" justifyContent="flex-end">
            <div className={classes.wrapper}>
              <CSVLink className={classes.icon} color="action" data={consultationStatus} headers={headers} separator=";"><Archive /></CSVLink>
            </div>
          </Box>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {consultationStatus.slice(page * limit, page * limit + limit).map((consultation) => (
                  <TableRow hover key={consultation.id} selected={selectedCustomerIds.indexOf(consultation.id) !== -1}>
                    <TableCell>{consultation.descricao}</TableCell>
                    <TableCell align="right" width="30%">
                      <IconButton onClick={() => onEdit(consultation)}><EditIcon color="primary" /></IconButton>
                      |
                      <IconButton
                        onClick={() => handleConfirm(consultation.id)}
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
          count={consultationStatus.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <MessageDiaglog ref={childRef} />
      <AlertDialog ref={chilRefAlert} handleConfirm={() => handleDelete(consultationStatusId)} />
    </>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  consultationStatus: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  getSituacaoConsulta: PropTypes.func
};

export default Results;
