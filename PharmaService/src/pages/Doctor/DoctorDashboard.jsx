import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import hook để chuyển trang
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const DoctorDashboard = () => {
  const navigate = useNavigate(); // 2. Khai báo hook

  // --- DỮ LIỆU MẪU (GIỮ NGUYÊN) ---
  const stats = [
    { title: "Chờ tư vấn", value: "5", icon: "⏳", color: "#e17055", desc: "Cần xử lý ngay" },
    { title: "Đang tư vấn", value: "3", icon: "💬", color: "#0984e3", desc: "Hội thoại đang mở" },
    { title: "Đã xong hôm nay", value: "18", icon: "✅", color: "#00b894", desc: "Ca tư vấn hoàn tất" },
    { title: "Tổng bệnh nhân", value: "1,204", icon: "👥", color: "#6c5ce7", desc: "Lịch sử tiếp nhận" },
  ];

  const activityData = [
    { name: 'Thứ 2', tu_van: 40, ke_don: 24 },
    { name: 'Thứ 3', tu_van: 30, ke_don: 13 },
    { name: 'Thứ 4', tu_van: 58, ke_don: 40 },
    { name: 'Thứ 5', tu_van: 45, ke_don: 29 },
    { name: 'Thứ 6', tu_van: 60, ke_don: 48 },
    { name: 'Thứ 7', tu_van: 34, ke_don: 15 },
    { name: 'CN', tu_van: 20, ke_don: 5 },
  ];

  const outcomeData = [
    { name: 'Chỉ tư vấn', value: 150 },
    { name: 'Kê đơn thuốc', value: 320 },
    { name: 'Nhập viện', value: 30 },
  ];
  
  const COLORS = ['#0984e3', '#00b894', '#d63031'];

  // --- STYLE CHO NÚT NHANH (HEADER) ---
  const actionCardStyle = {
    flex: 1,
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: '1px solid #eee'
  };

  return (
    <div className="doctor-container" style={{ padding: '20px', background: '#f4f6f9', minHeight: '100vh' }}>
      
      {/* 3. HEADER ĐIỀU HƯỚNG (QUICK ACTIONS) - PHẦN MỚI THÊM */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px', color: '#2d3436' }}>👋 Xin chào, Bác sĩ!</h2>
        
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Nút 1: Đi tới Chat */}
          <div 
            style={{ ...actionCardStyle, borderLeft: '5px solid #0984e3' }}
            onClick={() => navigate('/doctor/chat')}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(9, 132, 227, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '50%', color: '#0984e3', fontSize: '1.5rem' }}>
              <i className="fas fa-comments"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#333' }}>Tư vấn ngay</h4>
              <small style={{ color: '#666' }}>Mở danh sách tin nhắn</small>
            </div>
            <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', color: '#ccc' }}></i>
          </div>

          {/* Nút 2: Đi tới Kê đơn */}
          <div 
            style={{ ...actionCardStyle, borderLeft: '5px solid #00b894' }}
            onClick={() => navigate('/doctor/prescribe')} // Đổi đường dẫn nếu trang kê đơn của bạn tên khác
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 184, 148, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ background: '#e0fcf6', padding: '15px', borderRadius: '50%', color: '#00b894', fontSize: '1.5rem' }}>
              <i className="fas fa-file-prescription"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#333' }}>Tạo đơn thuốc</h4>
              <small style={{ color: '#666' }}>Kê đơn mới cho bệnh nhân</small>
            </div>
            <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', color: '#ccc' }}></i>
          </div>

          {/* Nút 3: Đi tới Đơn hàng */}
          <div 
            style={{ ...actionCardStyle, borderLeft: '5px solid #6c5ce7' }}
            onClick={() => navigate('/doctor/orders')}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(108, 92, 231, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ background: '#edeaff', padding: '15px', borderRadius: '50%', color: '#6c5ce7', fontSize: '1.5rem' }}>
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#333' }}>Quản lý đơn hàng</h4>
              <small style={{ color: '#666' }}>Xem lịch sử đơn thuốc</small>
            </div>
            <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', color: '#ccc' }}></i>
          </div>

        </div>
      </div>
      {/* KẾT THÚC PHẦN HEADER MỚI */}

      <h3 style={{ marginBottom: '20px', color: '#636e72', fontSize: '1.1rem' }}>📊 Tổng quan hôm nay</h3>

      {/* --- PHẦN CARDS THỐNG KÊ CŨ --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            borderLeft: `5px solid ${item.color}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ color: '#636e72', fontSize: '0.9rem', margin: 0 }}>{item.title}</p>
              <h3 style={{ fontSize: '2rem', color: '#2d3436', margin: '5px 0' }}>{item.value}</h3>
              <small style={{ color: '#b2bec3', fontSize: '0.8rem' }}>{item.desc}</small>
            </div>
            <div style={{ fontSize: '2.5rem', opacity: 0.2, color: item.color }}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* --- PHẦN BIỂU ĐỒ CŨ --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Biểu đồ Cột */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: '20px', color: '#2d3436' }}>📈 Tần suất tư vấn & Kê đơn (Tuần này)</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tu_van" name="Lượt tư vấn" fill="#74b9ff" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="ke_don" name="Đơn thuốc đã kê" fill="#00b894" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ Tròn */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h4 style={{ marginBottom: '20px', color: '#2d3436' }}>Tỷ lệ kết quả tư vấn</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={outcomeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {outcomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '10px' }}>
            {outcomeData.map((entry, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', fontSize: '0.9rem' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: COLORS[index], borderRadius: '50%', marginRight: '10px' }}></div>
                <span style={{ color: '#636e72' }}>{entry.name}: <strong>{entry.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;