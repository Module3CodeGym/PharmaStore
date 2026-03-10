import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const withAuthorization = (WrappedComponent, allowedRoles) => {
    return (props) => {
        const { user, loading } = useAuth();
        const location = useLocation();

        if (loading) {
            return <div>Loading...</div>;
        }

        if (!user) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }

        if (allowedRoles && !allowedRoles.includes(user.role)) {
            return <Navigate to="/admin/unauthorized" replace />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthorization;