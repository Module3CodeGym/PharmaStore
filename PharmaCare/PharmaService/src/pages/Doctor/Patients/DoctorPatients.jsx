import React, { useState, useEffect } from 'react';
// import { db } from '../../../firebaseConfig'; 
// import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- DỮ LIỆU ẢO (MOCK DATA) ---
  const MOCK_DATA = [
    {
      id: "patient_001",
      displayName: "Nguyễn Thị Thu Hà",
      phone: "0905123456",
      email: "thuha@gmail.com",
      address: "123 Nguyễn Văn Linh, Đà Nẵng",
      avatar: null // Giả sử chưa có avatar
    },
    {
      id: "patient_002",
      displayName: "Trần Văn Bình",
      phone: "0914987654",
      email: "binhtran@yahoo.com",
      address: "45 Lê Lợi, TP.HCM",
      avatar: null
    },
    {
      id: "patient_003",
      displayName: "Lê Văn Cường",
      phone: "0988111222",
      email: "cuongle.dev@gmail.com",
      address: "88 Cầu Giấy, Hà Nội",
      avatar: null
    },
    {
      id: "patient_004",
      displayName: "Phạm Thị Dung",
      phone: "0933444555",
      email: "dungpham@outlook.com",
      address: "12 Hùng Vương, Cần Thơ",
      avatar: null
    },
    {
      id: "patient_005",
      displayName: "Hoàng Văn Em",
      phone: "0977888999",
      email: "hoangem@company.vn",
      address: "TP. Hải Phòng",
      avatar: null
    }
  ];

  useEffect(() => {
    // Giả lập gọi API (Delay 1 giây cho giống thật)
    const fetchPatients = () => {
      setTimeout(() => {
        setPatients(MOCK_DATA);
        setLoading(false);
      }, 800);
    };

    fetchPatients();

    /* --- CODE FIREBASE CŨ (GIỮ LẠI ĐỂ SAU NÀY BẬT LẠI) ---
    const fetchPatientsFirebase = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "user")); 
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientsFirebase();
    */
  }, []);

  // Lọc theo tên hoặc SĐT
  const filteredPatients = patients.filter(p => 
    p.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  return (
    <div style={{ padding: '30px', background: '#f5f6fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2d3436', margin: 0 }}>👥 Danh sách bệnh nhân</h2>
        
        {/* Thanh tìm kiếm */}
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc SĐT..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              padding: '10px 15px 10px 40px', 
              width: '300px', 
              borderRadius: '20px', 
              border: '1px solid #dfe6e9',
              outline: 'none',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
            }}
          />
          <i className="fas fa-search" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#b2bec3' }}></i>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#636e72' }}>
          <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i> Đang tải dữ liệu...
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8f9fa', color: '#636e72', textAlign: 'left', borderBottom: '2px solid #e1e4e8' }}>
              <tr>
                <th style={{ padding: '15px' }}>Họ tên</th>
                <th style={{ padding: '15px' }}>Số điện thoại</th>
                <th style={{ padding: '15px' }}>Email</th>
                <th style={{ padding: '15px' }}>Địa chỉ</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#b2bec3', fontStyle: 'italic' }}>Không tìm thấy bệnh nhân nào khớp với từ khóa.</td></tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} style={{ borderBottom: '1px solid #f1f1f1', transition: 'background 0.2s' }}>
                    <td style={{ padding: '15px', fontWeight: '600', color: '#2d3436' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', 
                          background: '#0984e3', color: 'white', 
                          borderRadius: '50%', display: 'flex', 
                          alignItems: 'center', justifyContent: 'center', 
                          fontWeight: 'bold', fontSize: '1.1rem' 
                        }}>
                          {patient.displayName?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                            <div>{patient.displayName || "Chưa cập nhật"}</div>
                            <small style={{color: '#b2bec3', fontWeight: 'normal'}}>#{patient.id.split('_')[1]}</small>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px', color: '#636e72' }}>{patient.phone || "---"}</td>
                    <td style={{ padding: '15px', color: '#636e72' }}>{patient.email}</td>
                    <td style={{ padding: '15px', color: '#636e72' }}>{patient.address || "---"}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button 
                        onClick={() => navigate(`/doctor/patient/${patient.id}`)}
                        style={{ 
                          padding: '8px 15px', 
                          background: '#e3f9e5', 
                          color: '#00b894', 
                          border: 'none', 
                          borderRadius: '20px', 
                          cursor: 'pointer', 
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#00b894'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#e3f9e5'; e.currentTarget.style.color = '#00b894'; }}
                      >
                        <i className="fas fa-file-medical-alt"></i> Hồ sơ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorPatients;