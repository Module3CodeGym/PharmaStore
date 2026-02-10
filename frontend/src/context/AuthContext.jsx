import { createContext, useState, useContext, useEffect } from 'react';
import { mockApi } from '../services/mockData';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('pharma_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const userData = await mockApi.login(username, password);
            setUser(userData);
            localStorage.setItem('pharma_user', JSON.stringify(userData));
            toast.success(`Welcome back, ${userData.name}!`);
            return userData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const userData = await mockApi.register(formData);
            setUser(userData);
            localStorage.setItem('pharma_user', JSON.stringify(userData));
            toast.success('Registration successful!');
            return userData;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pharma_user');
        toast.info('Logged out successfully');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
