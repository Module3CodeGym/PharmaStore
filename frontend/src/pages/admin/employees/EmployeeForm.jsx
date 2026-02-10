import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../services/mockData';
import { useAuth } from '../../../context/AuthContext';
import './EmployeeForm.css';

const EmployeeForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'Staff',
        status: 'Active'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const loadEmployee = async () => {
                try {
                    const employee = await mockApi.getEmployeeById(id);
                    if (employee) {
                        setFormData({
                            name: employee.name,
                            email: employee.email,
                            username: employee.username || '',
                            password: employee.password || '',
                            role: employee.role,
                            status: employee.status
                        });
                    } else {
                        toast.error('Employee not found');
                        navigate('/employees');
                    }
                } catch (error) {
                    console.error("Error loading employee:", error);
                    toast.error('Error loading employee details');
                }
            };
            loadEmployee();
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
                await mockApi.updateEmployee(id, formData, user?.name);
                toast.success('Employee updated successfully!');
            } else {
                await mockApi.addEmployee(formData, user?.name);
                toast.success('Employee added successfully!');
            }
            navigate('/employees');
        } catch (error) {
            console.error("Error saving employee:", error);
            toast.error('Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="employee-form-container">
            <div className="page-header">
                <div className="header-title">
                    <button onClick={() => navigate('/employees')} className="btn-back">
                        <FaArrowLeft />
                    </button>
                    <h2>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="e.g. john@pharmacare.com"
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="Pharmacist">Pharmacist</option>
                            <option value="Staff">Staff</option>
                            <option value="Intern">Intern</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {!isEditMode && (
                        <>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter login username"
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter login password"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/employees')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <FaSave /> {loading ? 'Saving...' : (isEditMode ? 'Update Employee' : 'Save Employee')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
