import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from './RoleContext';

const ProtectedRoute = ({ element, roles }) => {
  const { role } = useRole();
  return roles.includes(role) ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
