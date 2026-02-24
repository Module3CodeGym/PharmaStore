import { useState, useEffect } from 'react';
import { FaDollarSign, FaBox, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { mockApi } from '../../../services/adminMockData';
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
        { title: 'Tổng doanh thu', value: formatCurrency(stats.totalSales), icon: <FaDollarSign />, color: '#0984e3' },
        { title: 'Tổng đơn hàng', value: stats.totalOrders.toLocaleString(), icon: <FaShoppingCart />, color: '#00b894' },
        { title: 'Tổng sản phẩm', value: stats.totalProducts.toLocaleString(), icon: <FaBox />, color: '#6c5ce7' },
        { title: 'Khách hàng mới', value: stats.newCustomers.toLocaleString(), icon: <FaUsers />, color: '#fdcb6e' },
    ];

    if (loading) {
        return <div className="dashboard-container">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="dashboard-container">
            <h2>Tổng quan hệ thống</h2>

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
                    <h3>Hoạt động gần đây</h3>
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
                        {recentActivity.length === 0 && <p>Không có hoạt động nào.</p>}
                    </ul>
                </div>
                <div className="section low-stock">
                    <h3>Cảnh báo tồn kho thấp</h3>
                    <table className="simple-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td className="text-danger">{product.stock}</td>
                                    <td>
                                        <span className={`badge ${product.stock === 0 ? 'critical' : 'warning'}`}>
                                            {product.stock === 0 ? 'Hết hàng' : 'Sắp hết hàng'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {lowStockProducts.length === 0 && (
                                <tr><td colSpan="3" style={{ textAlign: 'center' }}>Tồn kho đầy đủ.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
