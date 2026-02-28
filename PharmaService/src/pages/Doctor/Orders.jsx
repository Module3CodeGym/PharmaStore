import React from 'react';

const Orders = () => {
  // Dữ liệu này là LỊCH SỬ KÊ ĐƠN của riêng bác sĩ này
  const prescriptionHistory = [
      { id: "DT001", benh_nhan: "Nguyễn Văn A", chan_doan: "Viêm họng cấp", ngay_ke: "05/02/2026", trang_thai: "Đã mua thuốc" },
      { id: "DT002", benh_nhan: "Trần Thị B", chan_doan: "Rối loạn tiền đình", ngay_ke: "04/02/2026", trang_thai: "Đã mua thuốc" },
      { id: "DT003", benh_nhan: "Lê Thị C", chan_doan: "Dị ứng thời tiết", ngay_ke: "04/02/2026", trang_thai: "Chưa thanh toán" },
  ];

  return (
    <div className="tab-container">
      <h2>📋 Lịch sử kê đơn & Theo dõi bệnh án</h2>
      
      <div style={{display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center'}}>
        <label>Lọc theo ngày:</label>
        <input type="date" className="form-input" style={{maxWidth: '150px'}} />
        <button className="btn-add" style={{background: '#0984e3'}}>Xem báo cáo</button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Mã Đơn Thuốc</th>
            <th>Bệnh nhân</th>
            <th>Chẩn đoán (Lý do khám)</th>
            <th>Ngày kê</th>
            <th>Trạng thái đơn hàng</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {prescriptionHistory.map((item, index) => (
              <tr key={index}>
                <td><strong>#{item.id}</strong></td>
                <td>{item.benh_nhan}</td>
                <td>{item.chan_doan}</td>
                <td>{item.ngay_ke}</td>
                <td>
                    <span className={`status ${item.trang_thai === 'Đã mua thuốc' ? 'done' : 'ship'}`} 
                          style={{
                              backgroundColor: item.trang_thai === 'Đã mua thuốc' ? '#daf5ee' : '#fff3cd',
                              color: item.trang_thai === 'Đã mua thuốc' ? '#00b894' : '#856404'
                          }}>
                        {item.trang_thai}
                    </span>
                </td>
                <td>
                    <button className="btn-edit" style={{background: 'none', color: '#0984e3', border: '1px solid #0984e3'}}>
                        🔍 Xem lại đơn
                    </button>
                </td>
              </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;