/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

import {
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Shield as ShieldIcon,
  BarChart as BarChartIcon,
  Archive as ArchiveIcon,
  Settings as SettingsIcon,
  PlusSquare as PlusSquareIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  Key as LockIcon,
} from 'react-feather';
import NavItem from './NavItem';

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();

  let usuario = null;
  if (localStorage.getItem('app_token')) {
    usuario = jwtDecode(localStorage.getItem('app_token'));
  }

  const user = {
    jobTitle: usuario === null ? '' : usuario.tipoAbordagem,
    name: usuario === null ? '' : usuario.nome
  };

  const isAdmin = usuario === null ? false : (usuario.tipoUsuario === 'A');
  let items = [];

  if (isAdmin) {
    items = [
      {
        href: '/app/calendar',
        icon: CalendarIcon,
        title: 'SMind'
      },
      {
        href: '/app/pacients',
        icon: UserPlusIcon,
        title: 'Pacientes'
      },
      {
        href: '/app/users',
        icon: UsersIcon,
        title: 'Usuários'
      },
      {
        href: '/app/consultationStatus',
        icon: ShieldIcon,
        title: 'Situações da Consulta'
      },
      {
        href: '/app/approachTypes',
        icon: PlusSquareIcon,
        title: 'Tipos de Abordagem'
      },
      {
        href: '/app/consultationTypes',
        icon: ArchiveIcon,
        title: 'Tipos de Consulta'
      },
      {
        href: '/app/dashboard',
        icon: BarChartIcon,
        title: 'Dashboard'
      },
      {
        href: '/app/settings',
        icon: SettingsIcon,
        title: 'Configurações'
      },
      {
        href: '/app/profile',
        icon: LockIcon,
        title: 'Perfil'
      }
    ];
  } else {
    items = [
      {
        href: '/app/calendar',
        icon: CalendarIcon,
        title: 'SMind'
      },
      {
        href: '/app/pacients',
        icon: UserPlusIcon,
        title: 'Pacientes'
      },
      {
        href: '/app/dashboard',
        icon: BarChartIcon,
        title: 'Dashboard'
      },
      {
        href: '/app/settings',
        icon: SettingsIcon,
        title: 'Configurações'
      },
      {
        href: '/app/profile',
        icon: LockIcon,
        title: 'Perfil'
      }];
  }

  useEffect(() => {
    try {
      let usuario = null;
      if (localStorage.getItem('app_token')) {
        usuario = jwtDecode(localStorage.getItem('app_token'));
      }
      if (usuario === null) { navigate('../login', { replace: true }); }
    } catch (e) {
      navigate('../login', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {user.jobTitle}
        </Typography>
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
