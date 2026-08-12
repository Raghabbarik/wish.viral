import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Simple guard for admin routes. Checks for a token in localStorage.
export const AdminGuard = () => {
  const token = localStorage.getItem('adminToken');
  return token ? <Outlet /> : <Navigate to="/" replace />;
};
