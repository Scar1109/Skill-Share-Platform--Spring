import { Navigate } from "react-router-dom";
import { authService } from "../services/auth";

function ProtectedRoute({ children, requiredRole }) {
    const isAuthenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    // Check if user is authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If role is required, check if user has the required role
    if (requiredRole && currentUser?.role !== requiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;
