import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import UsersView from 'src/views/users/UsersView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import ForgotPasswordView from 'src/views/auth/ForgotPasswordView';
import SettingsView from 'src/views/settings/SettingsView';
import ApproachpesView from 'src/views/approachTypes/ApproachTypesView';
import ConsultationTypesView from 'src/views/consultationTypes/ConsultationTypesView';
import ConsultationStatusView from 'src/views/consultationStatus/ConsultationStatusView';
import CalendarView from 'src/views/calendar/CalendarView';
import PacientView from 'src/views/pacients/PacientsView';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'calendar', element: <CalendarView /> },
      { path: 'pacients', element: <PacientView /> },
      { path: 'users', element: <UsersView /> },
      { path: 'consultationStatus', element: <ConsultationStatusView /> },
      { path: 'approachTypes', element: <ApproachpesView /> },
      { path: 'consultationTypes', element: <ConsultationTypesView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: 'forgot', element: <ForgotPasswordView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/login" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
