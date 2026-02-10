import { useState } from 'react';
import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';
import './StockAdjustmentModal.css';

const StockAdjustmentModal = ({ isOpen, onClose, product, onConfirm }) => {
    const [amount, setAmount] = useState(1);
    const [type, setType] = useState('add'); // 'add' or 'remove'

    if (!isOpen || !product) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(product.id, parseInt(amount), type);
        onClose();
        setAmount(1); // Reset
        setType('add');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Adjust Stock</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="product-info">
                    <p className="product-name">{product.name}</p>
                    <p className="current-stock">Current Stock: <strong>{product.stock}</strong></p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Adjustment Amount</label>
                        <input
                            type="number"
                            min="1"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="adjustment-type">
                        <label>Operation</label>
                        <div className="type-selector">
                            <button
                                type="button"
                                className={`type-btn add ${type === 'add' ? 'active' : ''}`}
                                onClick={() => setType('add')}
                            >
                                <FaPlus /> Increase
                            </button>
                            <button
                                type="button"
                                className={`type-btn remove ${type === 'remove' ? 'active' : ''}`}
                                onClick={() => setType('remove')}
                            >
                                <FaMinus /> Decrease
                            </button>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">
                            Confirm Adjustment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockAdjustmentModal;
