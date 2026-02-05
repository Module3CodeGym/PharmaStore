import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../services/api';
import RevenueChart from '../../components/charts/RevenueChart';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <div className="stat-card">
        <div className={`stat-icon bg-${color}-light text-${color}`}>
            {icon}
        </div>
        <div className="stat-content">
            <h3 className="stat-title">{title}</h3>
            <div className="stat-value">{value}</div>
            {trend && (
                <div className={`stat-trend ${trend === 'up' ? 'text-success' : 'text-danger'}`}>
                    {trend === 'up' ? '↑' : '↓'} {trendValue}
                </div>
            )}
        </div>
    </div>
);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
    const [lowStockItems, setLowStockItems] = useState([]);
    const [expiringItems, setExpiringItems] = useState([]);
    const [period, setPeriod] = useState('daily');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, revenueRes, lowStockRes, expiringRes] = await Promise.all([
                    dashboardApi.getStats(),
                    dashboardApi.getRevenueData(period),
                    dashboardApi.getLowStockItems(),
                    dashboardApi.getExpiringItems()
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (revenueRes.success) setRevenueData(revenueRes.data);
                if (lowStockRes.success) setLowStockItems(lowStockRes.data);
                if (expiringRes.success) setExpiringItems(expiringRes.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period]);

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="page-header">
                <h1 className="page-title">Tổng quan</h1>
                <p className="page-description">Chào mừng trở lại, đây là tình hình kinh doanh hôm nay.</p>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Doanh thu"
                    value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0)}
                    icon="💰"
                    color="primary"
                />
                <StatCard
                    title="Đơn hàng mới"
                    value={stats?.newOrders || 0}
                    icon="🛒"
                    color="info"
                />
                <StatCard
                    title="Sắp hết hàng"
                    value={stats?.lowStockCount || 0}
                    icon="📉"
                    color="warning"
                />
                <StatCard
                    title="Sắp hết hạn"
                    value={stats?.expiringCount || 0}
                    icon="⚠️"
                    color="danger"
                />
            </div>

            <div className="dashboard-content-grid">
                {/* Revenue Chart Section */}
                <div className="chart-section card">
                    <div className="card-header flex justify-between items-center">
                        <h3 className="card-title">Biểu đồ doanh thu</h3>
                        <div className="chart-actions">
                            <button
                                className={`chart-filter-btn ${period === 'daily' ? 'active' : ''}`}
                                onClick={() => setPeriod('daily')}
                            >
                                Theo ngày
                            </button>
                            <button
                                className={`chart-filter-btn ${period === 'monthly' ? 'active' : ''}`}
                                onClick={() => setPeriod('monthly')}
                            >
                                Theo tháng
                            </button>
                        </div>
                    </div>
                    <div className="chart-container">
                        <RevenueChart data={revenueData} period={period} />
                    </div>
                </div>

                {/* Alerts Section */}
                <div className="alerts-section">
                    {/* Low Stock Widget */}
                    <div className="card mb-lg">
                        <div className="card-header flex justify-between items-center">
                            <h3 className="card-title text-warning">📦 Sắp hết hàng</h3>
                            <Link to="/inventory" className="text-sm text-primary">Xem tất cả</Link>
                        </div>
                        <div className="widget-list">
                            {lowStockItems.length > 0 ? (
                                lowStockItems.map(item => (
                                    <div key={item.id} className="widget-item">
                                        <div className="widget-item-info">
                                            <div className="font-medium">{item.productName}</div>
                                            <div className="text-sm text-muted">Batch: {item.batchNumber}</div>
                                        </div>
                                        <div className="widget-item-value text-danger font-bold">
                                            Còn: {item.quantity}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center p-md">Không có sản phẩm nào sắp hết hàng</p>
                            )}
                        </div>
                    </div>

                    {/* Expiring Soon Widget */}
                    <div className="card">
                        <div className="card-header flex justify-between items-center">
                            <h3 className="card-title text-danger">⏰ Sắp hết hạn</h3>
                            <Link to="/inventory" className="text-sm text-primary">Xem tất cả</Link>
                        </div>
                        <div className="widget-list">
                            {expiringItems.length > 0 ? (
                                expiringItems.map(item => (
                                    <div key={item.id} className="widget-item">
                                        <div className="widget-item-info">
                                            <div className="font-medium">{item.productName}</div>
                                            <div className="text-sm text-muted">HSD: {item.expiryDate}</div>
                                        </div>
                                        <span className="badge badge-danger">Sắp hết hạn</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted text-center p-md">Không có sản phẩm nào sắp hết hạn</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
