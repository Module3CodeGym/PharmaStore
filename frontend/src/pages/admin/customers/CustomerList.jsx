import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../services/mockData';
import { useAuth } from '../../../context/AuthContext';
import { formatCurrency } from '../../../utils/format';
import './CustomerList.css';

const CustomerList = () => {
    const { user } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await mockApi.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Error loading customers:", error);
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await mockApi.deleteCustomer(id, user?.name);
                setCustomers(customers.filter(c => c.id !== id));
                toast.success('Customer deleted successfully');
            } catch (error) {
                console.error("Error deleting customer:", error);
                toast.error('Failed to delete customer');
            }
        }
    };

    if (loading) return <div className="customer-list-container">Loading customers...</div>;

    return (
        <div className="customer-list-container">
            <div className="page-header">
                <h2>Customer Management</h2>
            </div>

            <div className="table-responsive">
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>Loyalty Points</th>
                            <th>Total Spend</th>
                            <th>Last Purchase</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id}>
                                <td>
                                    <div className="customer-name">
                                        <div className="avatar">{customer.name.charAt(0)}</div>
                                        <span>{customer.name}</span>
                                    </div>
                                </td>
                                <td>{customer.phone}</td>
                                <td>
                                    <span className="points-badge">{customer.points} pts</span>
                                </td>
                                <td>{formatCurrency(customer.totalSpend)}</td>
                                <td>{customer.lastPurchase}</td>
                                <td className="actions">
                                    <button className="btn-icon view" title="View History" onClick={() => toast.info('Customer history feature coming soon!')}>
                                        <FaEye />
                                    </button>
                                    <button onClick={() => handleDelete(customer.id)} className="btn-icon delete" title="Delete Customer">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {customers.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center' }}>No customers found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerList;
