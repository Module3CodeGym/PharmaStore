import { useState, useEffect } from 'react';
import { FaDollarSign, FaBox, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { mockApi } from '../../../services/mockData';
import { formatCurrency } from '../../../utils/format';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalSales: 0,
        totalOrders: 0,
        totalProducts: 0,
        newCustomers: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const statsData = await mockApi.getStats();
                const logsData = await mockApi.getLogs();
                const productsData = await mockApi.getProducts();

                setStats(statsData);
                setRecentActivity(logsData.slice(0, 5)); // Top 5 recent logs
                setLowStockProducts(productsData.filter(p => p.stock < 10));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const statCards = [
        { title: 'Total Sales', value: formatCurrency(stats.totalSales), icon: <FaDollarSign />, color: '#0984e3' },
        { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: <FaShoppingCart />, color: '#00b894' },
        { title: 'Total Products', value: stats.totalProducts.toLocaleString(), icon: <FaBox />, color: '#6c5ce7' },
        { title: 'New Customers', value: stats.newCustomers.toLocaleString(), icon: <FaUsers />, color: '#fdcb6e' },
    ];

    if (loading) {
        return <div className="dashboard-container">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Dashboard Overview</h2>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div className="stat-card" key={index} style={{ borderTopColor: stat.color }}>
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-sections">
                <div className="section recent-activity">
                    <h3>Recent Activity</h3>
                    <ul className="activity-list">
                        {recentActivity.map(log => (
                            <li key={log.id}>
                                <span className="time">{log.date.split(' ')[1]} {log.date.split(' ')[2]}</span>
                                <div>
                                    <p><strong>{log.action}</strong>: {log.details}</p>
                                    <small style={{ color: '#999' }}>{log.date}</small>
                                </div>
                            </li>
                        ))}
                        {recentActivity.length === 0 && <p>No recent activity.</p>}
                    </ul>
                </div>
                <div className="section low-stock">
                    <h3>Low Stock Alert</h3>
                    <table className="simple-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td className="text-danger">{product.stock}</td>
                                    <td>
                                        <span className={`badge ${product.stock === 0 ? 'critical' : 'warning'}`}>
                                            {product.stock === 0 ? 'Out of Stock' : 'Low'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {lowStockProducts.length === 0 && (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>No low stock alerts.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
