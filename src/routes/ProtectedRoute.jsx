import React from 'react';
import { Navigate } from 'react-router-dom';

// Check if the user is authenticated by checking for a session item
const isAuthenticated = () => sessionStorage.getItem('user') !== null;

const ProtectedRoute = ({ element }) => {
    return isAuthenticated() ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
