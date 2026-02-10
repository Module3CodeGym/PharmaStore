import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { mockApi } from '../../../../services/mockData';
import { useAuth } from '../../../../context/AuthContext';
import './ProductList.css';

const ProductList = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await mockApi.getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await mockApi.deleteProduct(id, user?.name);
                setProducts(products.filter(product => product.id !== id));
                toast.success('Product deleted successfully');
            } catch (error) {
                alert('Failed to delete product');
                console.error(error);
                toast.error('Failed to delete product');
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="product-list-container">Loading products...</div>;

    return (
        <div className="product-list-container">
            <div className="page-header">
                <h2>Product Management</h2>
                <Link to="/products/add" className="btn btn-primary">
                    <FaPlus /> Add New Product
                </Link>
            </div>

            <div className="toolbar">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{product.sku}</td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>${product.price.toFixed(2)}</td>
                                <td>
                                    <span className={`stock-badge ${product.stock < 10 ? 'low' : 'good'}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="actions">
                                    <Link to={`/products/edit/${product.id}`} className="btn-icon edit">
                                        <FaEdit />
                                    </Link>
                                    <button onClick={() => handleDelete(product.id)} className="btn-icon delete">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="6" className="no-data">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
