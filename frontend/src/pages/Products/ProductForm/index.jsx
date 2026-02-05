import React, { useState, useEffect } from 'react';
import { productsApi } from '../../../services/api';
import Input from '../../../components/common/Input/index';
import Button from '../../../components/common/Button/index';
import { toast } from 'react-toastify';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        activeIngredient: '',
        dosage: '',
        packaging: '',
        category: '',
        price: '',
        manufacturer: '',
        registrationNumber: '',
        description: '',
        imageUrl: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                activeIngredient: product.activeIngredient || '',
                dosage: product.dosage || '',
                packaging: product.packaging || '',
                category: product.category || '',
                price: product.price || '',
                manufacturer: product.manufacturer || '',
                registrationNumber: product.registrationNumber || '',
                description: product.description || '',
                imageUrl: product.imageUrl || ''
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const dataToSubmit = {
                ...formData,
                price: Number(formData.price) // Ensure price is a number
            };

            let result;
            if (product) {
                result = await productsApi.update(product.id, dataToSubmit);
            } else {
                result = await productsApi.create(dataToSubmit);
            }


            if (result.success) {
                toast.success(product ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
                // Log the action... (omitted for brevity in target matching)
                const user = 'Admin';
                const action = product ? `Cập nhật thuốc: ${formData.name}` : `Thêm thuốc mới: ${formData.name}`;
                const details = product
                    ? `Giá: ${product.price} -> ${formData.price}`
                    : `Danh mục: ${formData.category}, Giá: ${formData.price}`;

                import('../../../services/api').then(({ systemLogsApi }) => {
                    systemLogsApi.logAction({ user, action, module: 'Products', details });
                });

                onSubmit(result.data);
            } else {
                toast.error(result.error || 'Có lỗi xảy ra, vui lòng thử lại');
            }
        } catch (err) {
            toast.error('Lỗi kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Error display removed as using toast */}

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Tên thuốc"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Paracetamol 500mg"
                />

                <Input
                    label="Hoạt chất"
                    name="activeIngredient"
                    value={formData.activeIngredient}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Paracetamol"
                />

                <Input
                    label="Hàm lượng"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: 500mg"
                />

                <Input
                    label="Quy cách đóng gói"
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleChange}
                    placeholder="Ví dụ: Hộp 10 vỉ x 10 viên"
                />

                <Input
                    type="select"
                    label="Danh mục"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    options={[
                        { value: 'OTC', label: 'Thuốc không kê đơn (OTC)' },
                        { value: 'Kê đơn', label: 'Thuốc kê đơn (ETC)' },
                        { value: 'TPCN', label: 'Thực phẩm chức năng' }
                    ]}
                    placeholder="Chọn danh mục"
                />

                <Input
                    type="number"
                    label="Giá bán (VNĐ)"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="0"
                />

                <Input
                    label="Nhà sản xuất"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    placeholder="Ví dụ: Domesco"
                />

                <Input
                    label="Số đăng ký"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="Ví dụ: VD-12345-19"
                />
            </div>

            <div className="mt-4">
                <Input
                    type="textarea"
                    label="Mô tả / Chỉ định"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Mô tả công dụng, chỉ định..."
                />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Hủy bỏ
                </Button>
                <Button type="button" variant="primary" onClick={handleSubmit} loading={loading}>
                    {product ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
