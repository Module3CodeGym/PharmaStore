import React, { forwardRef } from 'react';
import './Invoice.css';

const Invoice = forwardRef(({ order }, ref) => {
    if (!order) return null;

    return (
        <div ref={ref} className="bg-white p-8 max-w-[800px] mx-auto text-gray-900" style={{ fontFamily: 'Times New Roman, serif' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">HÓA ĐƠN</h1>
                    <p className="text-sm">Mã đơn: <strong>{order.id}</strong></p>
                    <p className="text-sm">Ngày: {new Date(order.orderDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold text-teal-700">PHARMACARE</h2>
                    <p className="text-sm">123 Đường Thuốc, Quận 1, TP.HCM</p>
                    <p className="text-sm">Hotline: 1900 1234</p>
                    <p className="text-sm">Email: support@pharmacare.com</p>
                </div>
            </div>

            {/* Customer Info */}
            <div className="mb-8">
                <h3 className="text-sm font-bold uppercase text-gray-500 mb-2">Người nhận</h3>
                <div className="font-bold text-lg">{order.customerName}</div>
                <div>{order.customerPhone}</div>
                <div className="max-w-[300px]">{order.customerAddress}</div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
                <thead>
                    <tr className="border-b border-gray-300">
                        <th className="text-left py-2 font-bold uppercase text-sm">Sản phẩm</th>
                        <th className="text-center py-2 font-bold uppercase text-sm">SL</th>
                        <th className="text-right py-2 font-bold uppercase text-sm">Đơn giá</th>
                        <th className="text-right py-2 font-bold uppercase text-sm">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100">
                            <td className="py-3">{item.productName}</td>
                            <td className="py-3 text-center">{item.quantity}</td>
                            <td className="py-3 text-right">
                                {new Intl.NumberFormat('vi-VN').format(item.price)}
                            </td>
                            <td className="py-3 text-right font-medium">
                                {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-12">
                <div className="w-[250px] space-y-2">
                    <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(order.subtotal)} ₫</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Phí vận chuyển:</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(order.shippingFee)} ₫</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                            <span>Giảm giá:</span>
                            <span>-{new Intl.NumberFormat('vi-VN').format(order.discount)} ₫</span>
                        </div>
                    )}
                    <div className="flex justify-between border-t border-gray-800 pt-2 font-bold text-lg mt-2">
                        <span>TỔNG CỘNG:</span>
                        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 mt-12 pt-8 border-t border-gray-200">
                <p className="font-medium italic">Cảm ơn quý khách đã mua hàng tại PharmaCare!</p>
                <p>Vui lòng giữ lại hóa đơn để đổi trả trong vòng 3 ngày.</p>
            </div>
        </div>
    );
});

export default Invoice;
