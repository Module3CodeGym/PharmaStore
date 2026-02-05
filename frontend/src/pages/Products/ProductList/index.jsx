import React, { useState, useEffect } from 'react';
import { productsApi } from '../../../services/api';
import Table from '../../../components/common/Table/index';
import Button from '../../../components/common/Button/index';
import Input from '../../../components/common/Input/index';
import Modal from '../../../components/common/Modal/index';
import ProductForm from '../ProductForm';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, productId: null });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsApi.getAll();
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDeleteClick = (id) => {
        setDeleteModal({ isOpen: true, productId: id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.productId;
        setDeleteModal({ isOpen: false, productId: null });
        try {
            const response = await productsApi.delete(id);
            if (response.success) {
                fetchProducts();
            } else {
                alert('Xóa thất bại: ' + response.error);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleFormSubmit = async () => {
        // Refresh list after add/edit
        await fetchProducts();
        handleModalClose();
    };

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory ? product.category === filterCategory : true;
        return matchesSearch && matchesCategory;
    });

    const columns = [
        { key: 'id', label: 'Mã SP', sortable: true },
        { key: 'name', label: 'Tên thuốc', sortable: true },
        { key: 'activeIngredient', label: 'Hoạt chất', sortable: true },
        { key: 'category', label: 'Danh mục', sortable: true },
        {
            key: 'price',
            label: 'Giá bán',
            sortable: true,
            render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
        },
        { key: 'packaging', label: 'Quy cách' },
        {
            key: 'actions',
            label: 'Hành động',
            render: (_, product) => (
                <div className="flex gap-2">
                    <Button
                        size="small"
                        variant="outline"
                        onClick={() => handleEdit(product)}
                        icon="✏️"
                    >
                        Sửa
                    </Button>
                    <Button
                        size="small"
                        variant="danger"
                        onClick={() => handleDeleteClick(product.id)}
                        icon="🗑️"
                    >
                        Xóa
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="page-container">
            <div className="page-header flex justify-between items-center mb-6">
                <div>
                    <h1 className="page-title">Quản lý Sản phẩm</h1>
                    <p className="page-description">Danh sách thuốc và thực phẩm chức năng</p>
                </div>
                <Button variant="primary" icon="➕" onClick={handleAddNew}>
                    Thêm thuốc mới
                </Button>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4 p-4 flex-wrap">
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <Input
                            placeholder="Tìm kiếm theo tên thuốc hoặc hoạt chất..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon="🔍"
                        />
                    </div>
                    <div style={{ width: '200px' }}>
                        <Input
                            type="select"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            options={[
                                { value: 'OTC', label: 'Thuốc không kê đơn (OTC)' },
                                { value: 'Kê đơn', label: 'Thuốc kê đơn (ETC)' },
                                { value: 'TPCN', label: 'Thực phẩm chức năng' }
                            ]}
                            placeholder="Tất cả danh mục"
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredProducts}
                    loading={loading}
                    pagination={true}
                    pageSize={10}
                    emptyMessage="Không tìm thấy sản phẩm nào"
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={selectedProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
                size="large"
            >
                <ProductForm
                    product={selectedProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={handleModalClose}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, productId: null })}
                title="Xác nhận xóa"
                size="small"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteModal({ isOpen: false, productId: null })}>Hủy</Button>
                        <Button variant="danger" onClick={confirmDelete}>Xác nhận xóa</Button>
                    </div>
                }
            >
                <p>Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
            </Modal>
        </div>
    );
};

export default ProductList;
