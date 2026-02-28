import React, { useState, useEffect } from 'react';

const DoctorPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null); // State cho Modal xem chi tiết

  // --- DỮ LIỆU ẢO (MOCK DATA) ---
  const MOCK_PRESCRIPTIONS = [
    {
      id: "DT-00123",
      patientName: "Nguyễn Thị Thu Hà",
      date: "10/02/2026",
      diagnosis: "Viêm họng cấp",
      status: "completed", // completed: Đã mua, pending: Chưa mua
      drugs: [
        { name: "Amoxicillin 500mg", quantity: 15, dosage: "Sáng 1, Chiều 1, Tối 1 (Sau ăn)" },
        { name: "Paracetamol 500mg", quantity: 10, dosage: "Uống khi sốt > 38.5 độ" },
        { name: "Alpha Choay", quantity: 20, dosage: "Ngậm dưới lưỡi 4 viên/ngày" }
      ]
    },
    {
      id: "DT-00124",
      patientName: "Trần Văn Bình",
      date: "11/02/2026",
      diagnosis: "Rối loạn tiêu hóa",
      status: "pending",
      drugs: [
        { name: "Berberin", quantity: 20, dosage: "Sáng 2, Tối 2" },
        { name: "Oresol", quantity: 5, dosage: "Pha 1 gói với 200ml nước" }
      ]
    },
    {
      id: "DT-00125",
      patientName: "Lê Văn Cường",
      date: "11/02/2026",
      diagnosis: "Đau dạ dày",
      status: "cancelled",
      drugs: [
        { name: "Omeprazol 20mg", quantity: 30, dosage: "Uống trước ăn sáng 30p" },
        { name: "Gaviscon", quantity: 10, dosage: "Uống khi đau" }
      ]
    },
  ];

  // Lọc dữ liệu
  const filteredList = MOCK_PRESCRIPTIONS.filter(item => 
    item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ color: '#2d3436', margin: 0 }}>💊 Lịch sử đơn thuốc</h2>
          <p style={{ color: '#636e72', margin: '5px 0 0' }}>Quản lý các đơn thuốc bạn đã kê</p>
        </div>
        
        {/* Search Box */}
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Tìm theo Mã đơn hoặc Tên BN..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '12px 15px 12px 45px', 
              width: '320px', 
              borderRadius: '25px', 
              border: '1px solid #dfe6e9',
              outline: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          />
          <i className="fas fa-search" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: '#b2bec3' }}></i>
        </div>
      </div>

      {/* DANH SÁCH ĐƠN THUỐC (TABLE) */}
      <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa', color: '#636e72', textAlign: 'left', borderBottom: '2px solid #e1e4e8' }}>
            <tr>
              <th style={{ padding: '18px' }}>Mã đơn</th>
              <th style={{ padding: '18px' }}>Bệnh nhân</th>
              <th style={{ padding: '18px' }}>Chẩn đoán</th>
              <th style={{ padding: '18px' }}>Ngày kê</th>
              <th style={{ padding: '18px' }}>Trạng thái</th>
              <th style={{ padding: '18px', textAlign: 'center' }}>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f1f1', transition: 'background 0.2s' }}>
                <td style={{ padding: '18px', fontWeight: 'bold', color: '#0984e3' }}>{item.id}</td>
                <td style={{ padding: '18px', fontWeight: '600', color: '#2d3436' }}>{item.patientName}</td>
                <td style={{ padding: '18px', color: '#636e72' }}>{item.diagnosis}</td>
                <td style={{ padding: '18px', color: '#636e72' }}>{item.date}</td>
                <td style={{ padding: '18px' }}>
                  <span style={{ 
                    padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                    background: item.status === 'completed' ? '#e3f9e5' : item.status === 'pending' ? '#fff3cd' : '#ffecec',
                    color: item.status === 'completed' ? '#00b894' : item.status === 'pending' ? '#f39c12' : '#ff4757',
                  }}>
                    {item.status === 'completed' ? 'Đã cấp thuốc' : item.status === 'pending' ? 'Chờ mua' : 'Đã hủy'}
                  </span>
                </td>
                <td style={{ padding: '18px', textAlign: 'center' }}>
                  <button 
                    onClick={() => setSelectedPrescription(item)}
                    style={{ 
                      background: '#f1f2f6', border: 'none', width: '35px', height: '35px', borderRadius: '50%', 
                      cursor: 'pointer', color: '#636e72', transition: 'all 0.2s' 
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#0984e3'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#f1f2f6'; e.currentTarget.style.color = '#636e72'; }}
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL CHI TIẾT ĐƠN THUỐC --- */}
      {selectedPrescription && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center' 
        }} onClick={() => setSelectedPrescription(null)}>
          
          <div style={{ 
            background: 'white', width: '600px', borderRadius: '16px', padding: '30px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)', position: 'relative',
            animation: 'slideIn 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            
            <button 
              onClick={() => setSelectedPrescription(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#b2bec3' }}
            >
              &times;
            </button>

            <h3 style={{ margin: '0 0 5px 0', color: '#0984e3' }}>Chi tiết đơn thuốc</h3>
            <p style={{ margin: 0, color: '#636e72' }}>Mã đơn: <strong>{selectedPrescription.id}</strong></p>

            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div><small style={{color:'#b2bec3'}}>BỆNH NHÂN</small><div style={{fontWeight:'600'}}>{selectedPrescription.patientName}</div></div>
              <div><small style={{color:'#b2bec3'}}>NGÀY KÊ</small><div style={{fontWeight:'600'}}>{selectedPrescription.date}</div></div>
              <div style={{gridColumn: '1/-1'}}><small style={{color:'#b2bec3'}}>CHẨN ĐOÁN</small><div style={{fontWeight:'600'}}>{selectedPrescription.diagnosis}</div></div>
            </div>

            <h4 style={{ margin: '0 0 15px 0', color: '#2d3436' }}>Danh sách thuốc</h4>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f1f2f6' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem' }}>Tên thuốc</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.9rem' }}>SL</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem' }}>Liều dùng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPrescription.drugs.map((drug, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f1f1' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{drug.name}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>{drug.quantity}</td>
                      <td style={{ padding: '12px', color: '#636e72', fontSize: '0.9rem' }}>{drug.dosage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <button 
                onClick={() => setSelectedPrescription(null)}
                style={{ padding: '10px 25px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;