import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

/**
 * Authentication Context
 * Manages user authentication state and role-based access
 */

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for stored auth on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);
            if (response.success) {
                setUser(response.data.user);
                setToken(response.data.token);

                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('token', response.data.token);

                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    };

    const logout = async () => {
        await authApi.logout();
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const hasPermission = (allowedRoles) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        hasPermission
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
