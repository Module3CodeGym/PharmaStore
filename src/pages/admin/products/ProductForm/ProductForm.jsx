import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../../services/mockData';
import { useAuth } from '../../../../context/AuthContext';
import './ProductForm.css';

const ProductForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        price: '',
        stock: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const loadProduct = async () => {
                try {
                    const product = await mockApi.getProductById(id);
                    if (product) {
                        setFormData({
                            ...product,
                            price: product.price.toString(),
                            stock: product.stock.toString()
                        });
                    } else {
                        toast.error('Product not found');
                        navigate('/products');
                    }
                } catch (error) {
                    console.error("Error loading product:", error);
                    toast.error('Error loading product');
                }
            };
            loadProduct();
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
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock)
            };

            if (isEditMode) {
                await mockApi.updateProduct(id, productData, user?.name);
                toast.success('Product updated successfully!');
            } else {
                await mockApi.addProduct(productData, user?.name);
                toast.success('Product added successfully!');
            }
            navigate('/products');
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-container">
            <div className="page-header">
                <div className="header-title">
                    <button onClick={() => navigate('/products')} className="btn-back">
                        <FaArrowLeft />
                    </button>
                    <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Paracetamol 500mg"
                        />
                    </div>

                    <div className="form-group">
                        <label>SKU (Stock Keeping Unit)</label>
                        <input
                            type="text"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            placeholder="e.g. P001"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Pain Relievers">Pain Relievers</option>
                            <option value="Antibiotics">Antibiotics</option>
                            <option value="Supplements">Supplements</option>
                            <option value="Allergy">Allergy</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="form-group">
                        <label>Initial Stock</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            min="0"
                            placeholder="0"
                        />
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Product details..."
                    ></textarea>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/products')} className="btn btn-secondary">
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        <FaSave /> {loading ? 'Saving...' : (isEditMode ? 'Update Product' : 'Save Product')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
