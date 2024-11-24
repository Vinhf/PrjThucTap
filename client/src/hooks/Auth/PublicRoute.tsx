import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

const PublicRoute = () => {
  const token = localStorage.getItem('token');
  const decodedToken = useAuth();

  if (token && decodedToken) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
