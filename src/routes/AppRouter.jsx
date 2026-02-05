import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

import Dashboard from '../pages/Dashboard';
import ProductList from '../pages/Products/ProductList';
import InventoryList from '../pages/Inventory/InventoryList';
import BatchImportForm from '../pages/Inventory/BatchImportForm';
import OrderList from '../pages/Orders/OrderList';
import OrderDetail from '../pages/Orders/OrderDetail';
import CustomerList from '../pages/Customers/CustomerList';
import CustomerDetail from '../pages/Customers/CustomerDetail';
import StaffList from '../pages/Staff/StaffList';
import SystemLogs from '../pages/System/SystemLogs';

import Login from '../pages/Auth/Login';
import UserProfile from '../pages/Profile/UserProfile';

/**
 * Application Router Configuration
 * Defines all routes with role-based access control
 */

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        {/* Dashboard - accessible to all roles */}
                        <Route index element={<Dashboard />} />

                        {/* User Profile */}
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                    <UserProfile />
                                </ProtectedRoute>
                            }
                        />

                        {/* Products - admin and pharmacist only */}
                        <Route
                            path="products"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                    <ProductList />
                                </ProtectedRoute>
                            }
                        />

                        {/* Inventory - admin and pharmacist only */}
                        <Route path="inventory">
                            <Route
                                index
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                        <InventoryList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="import"
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                        <BatchImportForm />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Orders - admin and pharmacist only */}
                        <Route path="orders">
                            <Route
                                index
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                        <OrderList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path=":id"
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                        <OrderDetail />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Customers - admin and pharmacist only */}
                        <Route path="customers">
                            <Route
                                index
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                        <CustomerList />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path=":id"
                                element={
                                    <ProtectedRoute allowedRoles={['admin', 'pharmacist']}>
                                        <CustomerDetail />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Staff - admin only */}
                        <Route
                            path="staff"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <StaffList />
                                </ProtectedRoute>
                            }
                        />

                        {/* System Logs - admin only */}
                        <Route
                            path="system-logs"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <SystemLogs />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* Catch all - redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;
