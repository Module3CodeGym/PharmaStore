import { useState, useEffect } from 'react';
import { FaHistory, FaSortAmountDown } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../services/mockData';
import StockAdjustmentModal from './StockAdjustmentModal';
import './InventoryList.css';

const InventoryList = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        loadInventory();
    }, []);

    const loadInventory = async () => {
        try {
            const data = await mockApi.getInventory();
            setInventory(data);
        } catch (error) {
            console.error("Error loading inventory:", error);
            toast.error('Failed to load inventory');
        } finally {
            setLoading(false);
        }
    };

    const openAdjustmentModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleConfirmAdjustment = async (id, amount, type) => {
        try {
            await mockApi.updateStock(id, amount, type);
            loadInventory();
            toast.success(`Stock ${type === 'add' ? 'increased' : 'decreased'} successfully`);
        } catch (e) {
            console.error(e);
            toast.error('Failed to update stock');
        }
    };

    if (loading) return <div className="inventory-container">Loading inventory...</div>;

    return (
        <div className="inventory-container">
            <div className="page-header">
                <h2>Inventory Management</h2>
                <div className="header-actions">
                    <button className="btn btn-outline" onClick={() => toast.info('Inventory history coming soon')}>
                        <FaHistory /> View History
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>SKU</th>
                            <th>Current Stock</th>
                            <th>Unit</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.sku}</td>
                                <td className="stock-cell">
                                    <strong>{item.stock}</strong>
                                </td>
                                <td>{item.unit}</td>
                                <td>
                                    <span className={`status-badge ${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>{item.lastUpdated}</td>
                                <td>
                                    <button
                                        onClick={() => openAdjustmentModal(item)}
                                        className="btn-icon edit"
                                        title="Adjust Stock"
                                    >
                                        <FaSortAmountDown />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {inventory.length === 0 && <tr><td colSpan="7" style={{ textAlign: 'center' }}>No inventory items.</td></tr>}
                    </tbody>
                </table>
            </div>

            <StockAdjustmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onConfirm={handleConfirmAdjustment}
            />
        </div>
    );
};

export default InventoryList;
