import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../services/mockData';
import { useAuth } from '../../../context/AuthContext';
import './CustomerForm.css';

const CustomerForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '' // Added address field for completeness
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const loadCustomer = async () => {
                try {
                    const customer = await mockApi.getCustomerById(id);
                    if (customer) {
                        setFormData({
                            name: customer.name,
                            phone: customer.phone,
                            address: customer.address || ''
                        });
                    } else {
                        toast.error('Customer not found');
                        navigate('/customers');
                    }
                } catch (error) {
                    console.error("Error loading customer:", error);
                    toast.error('Error loading customer details');
                }
            };
            loadCustomer();
        }
    }, [isEditMode, id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditMode) {
                await mockApi.updateCustomer(id, formData, user?.name);
                toast.success('Customer updated successfully!');
            } else {
                await mockApi.addCustomer(formData, user?.name);
                toast.success('Customer added successfully!');
            }
            navigate('/customers');
        } catch (error) {
            console.error("Error saving customer:", error);
            toast.error('Failed to save customer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="customer-form-container">
            <div className="page-header">
                <div className="header-title">
                    <button onClick={() => navigate('/customers')} className="btn-back">
                        <FaArrowLeft />
                    </button>
                    <h2>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="customer-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Nguyen Van A"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="e.g. 0901234567"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="e.g. 123 Main St, Hanoi"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/customers')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <FaSave /> {loading ? 'Saving...' : (isEditMode ? 'Update Customer' : 'Save Customer')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
