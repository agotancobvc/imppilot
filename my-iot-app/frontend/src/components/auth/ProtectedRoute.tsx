import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireClinician?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireClinician = false 
}) => {
  const { clinic, clinician } = useAuthStore();

  if (!clinic) {
    return <Navigate to="/clinic/login" replace />;
  }

  if (requireClinician && !clinician) {
    return <Navigate to="/clinician/login" replace />;
  }

  return <>{children}</>;
};
