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
  onEdit, className, approachTypes, getTipoAbordagem, ...rest
}) => {
  const classes = useStyles();
  const [selectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const childRef = useRef();
  const chilRefAlert = useRef();
  const [approachTypeId, setApproachTypeId] = useState(0);

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
    setApproachTypeId(id);
    chilRefAlert.current.handleClickOpen();
  };

  const handleDelete = async (id) => {
    await api.delete(`/tipoAbordagem/${id}`);
    childRef.current.handleOpenMessage('Tipo de Abordagem deletado com sucesso!', 'success');
    getTipoAbordagem();
  };

  return (
    <>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardHeader title="Lista de Tipo de Abordagem" />
        <Divider />
        <PerfectScrollbar>
          <Box display="flex" justifyContent="flex-end">
            <div className={classes.wrapper}>
              <CSVLink className={classes.icon} color="action" data={approachTypes} headers={headers} separator=";"><Archive /></CSVLink>
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
                {approachTypes.slice(page * limit, page * limit + limit).map((approachType) => (
                  <TableRow hover key={approachType.id} selected={selectedCustomerIds.indexOf(approachType.id) !== -1}>
                    <TableCell>{approachType.descricao}</TableCell>
                    <TableCell align="right" width="30%">
                      <IconButton onClick={() => onEdit(approachType)}><EditIcon color="primary" /></IconButton>
                      |
                      <IconButton
                        onClick={() => handleConfirm(approachType.id)}
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
          count={approachTypes.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <MessageDiaglog ref={childRef} />
      <AlertDialog ref={chilRefAlert} handleConfirm={() => handleDelete(approachTypeId)} />
    </>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  approachTypes: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  getTipoAbordagem: PropTypes.func
};

export default Results;
