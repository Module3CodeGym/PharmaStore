import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import Header from '../Header';
import './MainLayout.css';

/**
 * Main Layout Component
 * Combines Sidebar, Header, and content area
 */

const MainLayout = ({ userRole = 'admin', user }) => {
    return (
        <div className="main-layout">
            <Sidebar userRole={userRole} />
            <div className="main-content-wrapper">
                <Header user={user} />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
