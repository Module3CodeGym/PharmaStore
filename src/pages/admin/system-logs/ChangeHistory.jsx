import { useState, useEffect } from 'react';
import {
    FaHistory,
    FaSearch,
    FaFilter,
    FaClipboardList,
    FaBoxOpen,
    FaUserPlus,
    FaUserEdit,
    FaTimesCircle,
    FaCheckCircle,
    FaArrowRight,
    FaUserAlt
} from 'react-icons/fa';
import { mockApi } from '../../../services/mockData';
import './ChangeHistory.css';

const ChangeHistory = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('All');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const data = await mockApi.getLogs();
            setLogs(data);
        } catch (error) {
            console.error("Error loading logs:", error);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'Order Status Updated': return <FaClipboardList className="icon-order" />;
            case 'Product Added': return <FaBoxOpen className="icon-product" />;
            case 'Product Updated': return <FaBoxOpen className="icon-product" />;
            case 'Product Deleted': return <FaTimesCircle className="icon-danger" />;
            case 'Stock Updated': return <FaCheckCircle className="icon-inventory" />;
            case 'Customer Created': return <FaUserPlus className="icon-user" />;
            case 'Customer Updated': return <FaUserAlt className="icon-user" />;
            case 'Customer Deleted': return <FaTimesCircle className="icon-danger" />;
            case 'Employee Added': return <FaUserPlus className="icon-employee" />;
            case 'Employee Deleted': return <FaTimesCircle className="icon-danger" />;
            default: return <FaHistory />;
        }
    };

    const getActionCategory = (action) => {
        if (action.includes('Order')) return 'cat-order';
        if (action.includes('Product') || action.includes('Stock')) return 'cat-inventory';
        if (action.includes('Customer') || action.includes('Employee')) return 'cat-people';
        if (action.includes('Deleted')) return 'cat-danger';
        return 'cat-default';
    };

    const actionTypes = ['All', ...new Set(logs.map(log => log.action))];

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAction = actionFilter === 'All' || log.action === actionFilter;

        return matchesSearch && matchesAction;
    });

    if (loading) return (
        <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu lịch sử...</p>
        </div>
    );

    return (
        <div className="history-container">
            <div className="page-header-premium">
                <div className="title-section">
                    <h1><FaHistory /> Lịch sử hệ thống</h1>
                    <p>Theo dõi hoạt động và thay đổi thời gian thực</p>
                </div>

                <div className="controls-section">
                    <div className="search-box-premium">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Mã, người dùng, chi tiết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-box-premium">
                        <FaFilter className="filter-icon" />
                        <select
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                        >
                            {actionTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="timeline-wrapper">
                {filteredLogs.map((log, index) => (
                    <div className={`timeline-item ${getActionCategory(log.action)}`} key={log.id}>
                        <div className="timeline-marker">
                            {getActionIcon(log.action)}
                        </div>
                        <div className="timeline-content-card">
                            <div className="card-header">
                                <span className="action-badge">{log.action}</span>
                                <span className="log-time">{log.date}</span>
                            </div>

                            <div className="card-body">
                                <h3 className="log-target">{log.target}</h3>
                                <p className="log-details">{log.details}</p>
                            </div>

                            <div className="card-footer">
                                <div className="executor-info">
                                    <FaUserAlt className="user-icon" />
                                    <span>Thực hiện bởi: <strong>{log.user}</strong></span>
                                </div>
                            </div>
                        </div>
                        {index < filteredLogs.length - 1 && <div className="timeline-connector"></div>}
                    </div>
                ))}

                {filteredLogs.length === 0 && (
                    <div className="empty-state-logs">
                        <FaSearch size={40} />
                        <p>Không tìm thấy hoạt động nào khớp với bộ lọc của bạn.</p>
                        <button className="btn-text" onClick={() => { setSearchTerm(''); setActionFilter('All') }}>
                            Xóa tất cả bộ lọc
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChangeHistory;
