import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi, inventoryApi } from '../../../services/api';
import Input from '../../../components/common/Input/index';
import Button from '../../../components/common/Button/index';
import { toast } from 'react-toastify';
import './BatchImportForm.css';

const BatchImportForm = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingProducts, setFetchingProducts] = useState(true);

    const [formData, setFormData] = useState({
        productId: '',
        batchNumber: '',
        quantity: '',
        expiryDate: '',
        shelfLocation: '',
        supplier: '',
        importPrice: '',
        notes: ''
    });

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const response = await productsApi.getAll();
                if (response.success) {
                    setProducts(response.data);
                }
            } catch (error) {
                console.error('Failed to load products:', error);
            } finally {
                setFetchingProducts(false);
            }
        };
        loadProducts();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const selectedProduct = products.find(p => p.id === formData.productId);

            const batchData = {
                ...formData,
                productName: selectedProduct?.name || 'Unknown',
                quantity: Number(formData.quantity),
                importPrice: Number(formData.importPrice)
            };

            const result = await inventoryApi.addBatch(batchData);

            if (result.success) {
                toast.success('Nhập kho thành công!');
                navigate('/inventory');
            } else {
                toast.error('Lỗi: ' + result.error);
            }
        } catch (error) {
            console.error('Error importing batch:', error);
            toast.error('Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const productOptions = products.map(p => ({
        value: p.id,
        label: `${p.name} (${p.activeIngredient})`
    }));

    return (
        <div className="page-container">
            <div className="page-header mb-6">
                <h1 className="page-title">Nhập Kho</h1>
                <p className="page-description">Tạo phiếu nhập kho lô hàng mới</p>
            </div>

            <div className="card max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold mb-4 text-primary">Thông tin lô hàng</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <Input
                                type="select"
                                label="Chọn sản phẩm"
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                required
                                options={productOptions}
                                placeholder={fetchingProducts ? "Đang tải danh sách..." : "Chọn thuốc / sản phẩm"}
                                disabled={fetchingProducts}
                            />
                        </div>

                        <Input
                            label="Số lô (Batch Number)"
                            name="batchNumber"
                            value={formData.batchNumber}
                            onChange={handleChange}
                            required
                            placeholder="VD: B2024-001"
                        />

                        <Input
                            type="date"
                            label="Hạn sử dụng"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            type="number"
                            label="Số lượng nhập"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="1"
                        />

                        <Input
                            type="number"
                            label="Giá nhập (VNĐ/đơn vị)"
                            name="importPrice"
                            value={formData.importPrice}
                            onChange={handleChange}
                            required
                            min="0"
                        />

                        <Input
                            label="Vị trí lưu kho (Kệ/Ngăn)"
                            name="shelfLocation"
                            value={formData.shelfLocation}
                            onChange={handleChange}
                            placeholder="VD: A-01-02"
                        />

                        <Input
                            label="Nhà cung cấp"
                            name="supplier"
                            value={formData.supplier}
                            onChange={handleChange}
                            placeholder="Nhập tên nhà cung cấp"
                        />
                    </div>

                    <div className="mt-4">
                        <Input
                            type="textarea"
                            label="Ghi chú"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/inventory')}
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            icon="📥"
                        >
                            Xác nhận nhập kho
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BatchImportForm;
