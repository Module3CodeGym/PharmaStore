import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserShield, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../services/mockData';
import { useAuth } from '../../../context/AuthContext';
import './EmployeeList.css';

const EmployeeList = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await mockApi.getEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Error loading employees:", error);
            toast.error('Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await mockApi.deleteEmployee(id, user?.name);
                setEmployees(employees.filter(e => e.id !== id));
                toast.success('Employee deleted successfully');
            } catch (error) {
                console.error("Error deleting employee:", error);
                toast.error('Failed to delete employee');
            }
        }
    };

    if (loading) return <div className="employee-list-container">Loading employees...</div>;

    return (
        <div className="employee-list-container">
            <div className="page-header">
                <h2>Employee Management</h2>
                <Link to="/employees/add" className="btn btn-primary">
                    <FaUserPlus /> Add Employee
                </Link>
            </div>

            <div className="employee-grid">
                {employees.map(employee => (
                    <div className="employee-card" key={employee.id}>
                        <div className="card-header">
                            <div className="role-badge">
                                <FaUserShield /> {employee.role}
                            </div>
                            <div className={`status-dot ${employee.status.toLowerCase()}`}></div>
                        </div>
                        <div className="card-body">
                            <div className="employee-avatar">
                                {employee.name.charAt(0)}
                            </div>
                            <h3>{employee.name}</h3>
                            <p>{employee.email}</p>
                        </div>
                        <div className="card-actions">
                            <Link to={`/employees/edit/${employee.id}`} className="btn-icon edit" title="Edit Employee">
                                <FaEdit />
                            </Link>
                            <button onClick={() => handleDelete(employee.id)} className="btn-icon delete" title="Delete Employee">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
