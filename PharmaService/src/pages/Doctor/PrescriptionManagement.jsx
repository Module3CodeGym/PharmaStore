import React, { useState, useMemo } from 'react';


const PrescriptionManagement = () => {
  // ... (Phần Data và State giữ nguyên như cũ) ...
  // CHÚ Ý: Đảm bảo bạn có các biến state này:
  const [requests, setRequests] = useState([
      { id: 1, benh_nhan: "Nguyễn Văn A", trieu_chung: "Ho nhiều, đau rát họng", hinh_anh: "https://via.placeholder.com/600x800/e0e0e0/000000?text=ANH+DON+THUOC+1", trang_thai: "Chờ duyệt" },
      { id: 2, benh_nhan: "Trần Thị B", trieu_chung: "Đau đầu, chóng mặt", hinh_anh: "https://via.placeholder.com/600x800/e0e0e0/000000?text=ANH+DON+THUOC+2", trang_thai: "Chờ duyệt" },
  ]);
  const medicines = [
      { id: 1, ten: "Panadol Extra", don_vi: "Viên", gia: 2000 },
      { id: 2, ten: "Vitamin C 500mg", don_vi: "Vỉ", gia: 15000 },
      { id: 3, ten: "Siro Ho Prospan", don_vi: "Chai", gia: 75000 },
      { id: 4, ten: "Augmentin 625mg", don_vi: "Viên", gia: 12000 },
  ];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentRequest, setCurrentRequest] = useState(null);
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [selectedMedId, setSelectedMedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  // Logic lọc tìm kiếm
  const filteredRequests = useMemo(() => {
      return requests.filter(req => 
        req.benh_nhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toString().includes(searchTerm)
      );
  }, [requests, searchTerm]);

  const openPrescribeModal = (request) => {
    setCurrentRequest(request);
    setPrescriptionList([]);
    setIsModalOpen(true);
  };

  const addMedToPrescription = () => {
    if (!selectedMedId) return alert("Vui lòng chọn thuốc!");
    if (quantity <= 0) return alert("Số lượng phải > 0!");
    
    const medInfo = medicines.find(m => m.id === parseInt(selectedMedId));
    const newItem = { ...medInfo, so_luong: quantity, ghi_chu: note || "Theo chỉ định" };
    
    setPrescriptionList([...prescriptionList, newItem]);
    setQuantity(1);
    setNote("");
  };

  const removeMedFromList = (indexToRemove) => {
    setPrescriptionList(prescriptionList.filter((_, index) => index !== indexToRemove));
  }

  const savePrescription = () => {
    if (prescriptionList.length === 0) return alert("Chưa kê thuốc nào!");
    const updatedRequests = requests.map(req => 
      req.id === currentRequest.id ? { ...req, trang_thai: "Đã duyệt" } : req
    );
    setRequests(updatedRequests);
    alert(`Đã hoàn tất đơn thuốc cho: ${currentRequest.benh_nhan}`);
    setIsModalOpen(false);
  };

  return (
    <div className="doctor-container page-container">
      {/* ... (Phần Header và Table giữ nguyên như cũ) ... */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h2 className="page-title">👨‍⚕️ Bác sĩ: Danh sách bệnh nhân</h2>
        <div style={{marginBottom: '20px'}}>
            <input type="text" placeholder="🔍 Tìm bệnh nhân..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-input" style={{width: '250px'}} />
        </div>
      </div>

      <div className="table-responsive">
        <table className="custom-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Bệnh nhân</th>
                <th>Triệu chứng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
            </tr>
            </thead>
            <tbody>
            {filteredRequests.map(req => (
                <tr key={req.id}>
                <td>#{req.id}</td>
                <td><strong>{req.benh_nhan}</strong></td>
                <td>{req.trieu_chung}</td>
                <td><span className={`status-badge ${req.trang_thai === 'Chờ duyệt' ? 'status-pending' : 'status-done'}`}>{req.trang_thai}</span></td>
                <td>
                    {req.trang_thai === 'Chờ duyệt' && (
                    <button className="btn btn-primary-outline" onClick={() => openPrescribeModal(req)}>✏️ Xử lý đơn</button>
                    )}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {/* --- MODAL CHIA ĐÔI MÀN HÌNH (SPLIT VIEW) --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          {/* Tăng độ rộng modal lên 90% màn hình để chia đôi cho dễ */}
          <div className="modal-content" style={{width: '90%', maxWidth: '1200px', height: '85vh', display: 'flex', flexDirection: 'column', padding: 0}}>
            
            {/* Header Modal */}
            <div className="modal-header" style={{padding: '15px 20px', borderBottom: '1px solid #eee', margin: 0}}>
                <h3>💊 Kê đơn: {currentRequest.benh_nhan}</h3>
                <button className="btn-close" onClick={() => setIsModalOpen(false)}>×</button>
            </div>

            {/* Body Modal: Chia 2 cột */}
            <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
                
                {/* CỘT TRÁI: HIỂN THỊ ẢNH ĐƠN THUỐC */}
                <div style={{flex: 1, borderRight: '1px solid #ddd', background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative'}}>
                    <p style={{position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px'}}>
                        📸 Ảnh đơn thuốc gốc
                    </p>
                    <img 
                        src={currentRequest.hinh_anh} 
                        alt="Đơn thuốc" 
                        style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}} 
                    />
                </div>

                {/* CỘT PHẢI: FORM KÊ ĐƠN */}
                <div style={{flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
                    
                    <div className="patient-info-box">
                        <p><strong>Triệu chứng:</strong> {currentRequest.trieu_chung}</p>
                    </div>

                    <div className="prescription-form-container">
                        <h4>Thêm thuốc:</h4>
                        <div className="form-row">
                            <select className="form-input flex-grow" value={selectedMedId} onChange={(e) => setSelectedMedId(e.target.value)}>
                                <option value="">-- Chọn thuốc --</option>
                                {medicines.map(m => (
                                <option key={m.id} value={m.id}>{m.ten} ({m.don_vi})</option>
                                ))}
                            </select>
                            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="form-input width-small" />
                        </div>
                        <div className="form-row mt-2">
                            <input type="text" placeholder="HDSD (Sáng/Chiều...)" value={note} onChange={(e) => setNote(e.target.value)} className="form-input flex-grow" />
                            <button onClick={addMedToPrescription} className="btn btn-primary btn-add-med">⬇ Thêm</button>
                        </div>
                    </div>

                    {/* List thuốc (chiếm khoảng trống còn lại) */}
                    <div className="added-meds-list" style={{flex: 1}}>
                        {prescriptionList.length === 0 ? <p className="empty-list-text">Danh sách đang trống...</p> : (
                            <ul>
                            {prescriptionList.map((item, index) => (
                                <li key={index}>
                                    <div className="med-info">
                                        <span>{item.ten}</span>
                                        <span>x{item.so_luong} {item.don_vi}</span>
                                    </div>
                                    <div className="med-note">{item.ghi_chu}</div>
                                    <button className="btn-remove-med" onClick={() => removeMedFromList(index)}>Xóa</button>
                                </li>
                            ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Modal */}
            <div className="modal-footer" style={{padding: '15px 20px', background: '#f9f9f9'}}>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Hủy bỏ</button>
              <button className="btn btn-primary" onClick={savePrescription}>💾 Hoàn tất & Gửi</button>
            </div>
          
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;