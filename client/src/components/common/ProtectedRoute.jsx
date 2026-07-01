import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const { user, isInitialized, isLoading } = useAuthStore();
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
