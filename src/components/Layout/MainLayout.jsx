import Sidebar from './Sidebar';
import Header from './Header';
// import { Outlet } from 'react-router-dom'; // If using nested routes in App.jsx

const MainLayout = ({ children }) => {
    return (
        <>
            <Sidebar />
            <div className="main-content">
                <Header />
                <div className="content-area">
                    {children}
                </div>
            </div>
        </>
    );
};

export default MainLayout;
