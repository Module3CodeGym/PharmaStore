import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  // --- DỮ LIỆU THỐNG KÊ (MẪU) ---
  const stats = [
    { title: "Chờ khám", value: "3", icon: "⏳", color: "#e17055", desc: "Bệnh nhân đang đợi" },
    { title: "Đang tư vấn", value: "2", icon: "💬", color: "#0984e3", desc: "Cuộc hội thoại mở" },
    { title: "Đã khám xong", value: "12", icon: "✅", color: "#00b894", desc: "Hoàn tất hôm nay" },
    { title: "Tổng bệnh nhân", value: "1,204", icon: "👥", color: "#6c5ce7", desc: "Lịch sử tiếp nhận" },
  ];

  // Biểu đồ hoạt động khám bệnh
  const activityData = [
    { name: 'Thứ 2', kham_benh: 20, tu_van: 40 },
    { name: 'Thứ 3', kham_benh: 15, tu_van: 30 },
    { name: 'Thứ 4', kham_benh: 25, tu_van: 58 },
    { name: 'Thứ 5', kham_benh: 18, tu_van: 45 },
    { name: 'Thứ 6', kham_benh: 30, tu_van: 60 },
    { name: 'Thứ 7', kham_benh: 10, tu_van: 34 },
    { name: 'CN', kham_benh: 5, tu_van: 20 },
  ];

  // Biểu đồ kết quả chẩn đoán
  const outcomeData = [
    { name: 'Kê đơn thuốc', value: 320 },
    { name: 'Tư vấn sức khỏe', value: 150 },
    { name: 'Chuyển viện', value: 15 },
  ];
  
  const COLORS = ['#00b894', '#0984e3', '#d63031'];

  const actionCardStyle = {
    flex: 1,
    minWidth: '280px',
    background: 'white',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '1px solid #f1f2f6'
  };

  return (
    <div style={{ padding: '30px', background: '#f8f9fa', minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '10px', color: '#2d3436', fontWeight: '700' }}>👋 Xin chào, Bác sĩ!</h2>
        <p style={{ color: '#636e72' }}>Chúc bạn một ngày làm việc hiệu quả. Dưới đây là tổng quan công việc hôm nay.</p>
        
        {/* QUICK ACTIONS */}
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', marginTop: '30px' }}>
          
          {/* Lịch khám */}
          <div 
            style={{ ...actionCardStyle, borderLeft: '6px solid #e17055' }}
            onClick={() => navigate('/doctor/appointments')}
          >
            <div style={{ background: '#ffefe6', padding: '18px', borderRadius: '50%', color: '#e17055', fontSize: '1.8rem' }}>
              <i className="fas fa-calendar-check"></i>
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Lịch khám bệnh</h4>
              <small style={{ color: '#636e72' }}>Xem danh sách bệnh nhân chờ</small>
            </div>
          </div>

          {/* Chat */}
          <div 
            style={{ ...actionCardStyle, borderLeft: '6px solid #0984e3' }}
            onClick={() => navigate('/doctor/chat')}
          >
            <div style={{ background: '#e3f2fd', padding: '18px', borderRadius: '50%', color: '#0984e3', fontSize: '1.8rem' }}>
              <i className="fas fa-comments"></i>
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Tư vấn sức khỏe</h4>
              <small style={{ color: '#636e72' }}>Trả lời tin nhắn bệnh nhân</small>
            </div>
          </div>

          {/* Khám bệnh */}
          <div 
            style={{ ...actionCardStyle, borderLeft: '6px solid #00b894' }}
            onClick={() => navigate('/doctor/exams')}
          >
            <div style={{ background: '#e0fcf6', padding: '18px', borderRadius: '50%', color: '#00b894', fontSize: '1.8rem' }}>
              <i className="fas fa-stethoscope"></i>
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Bắt đầu khám</h4>
              <small style={{ color: '#636e72' }}>Vào phòng khám bệnh</small>
            </div>
          </div>

          {/* ⭐ NÚT MỚI: Đặt lịch cho bệnh nhân */}
          <div 
            style={{ ...actionCardStyle, borderLeft: '6px solid #6c5ce7' }}
            onClick={() => navigate('/doctor/create-appointment')}
          >
            <div style={{ background: '#efeaff', padding: '18px', borderRadius: '50%', color: '#6c5ce7', fontSize: '1.8rem' }}>
              <i className="fas fa-user-plus"></i>
            </div>
            <div>
              <h4 style={{ margin: 0 }}>Đặt lịch cho bệnh nhân</h4>
              <small style={{ color: '#636e72' }}>Tạo lịch khám mới</small>
            </div>
          </div>

        </div>
      </div>

      {/* STATS */}
      <h3 style={{ marginBottom: '25px' }}>📊 Thống kê nhanh</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {stats.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '16px',
            borderLeft: `5px solid ${item.color}`,
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <p style={{ margin: 0 }}>{item.title}</p>
            <h3>{item.value}</h3>
            <small>{item.desc}</small>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

        <div style={{ background: 'white', padding: '30px', borderRadius: '16px' }}>
          <h4>📈 Hiệu suất làm việc</h4>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Legend/>
              <Bar dataKey="kham_benh" fill="#00b894"/>
              <Bar dataKey="tu_van" fill="#74b9ff"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', padding: '30px', borderRadius: '16px' }}>
          <h4>Tỷ lệ đầu ra</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={outcomeData} dataKey="value" innerRadius={60} outerRadius={90}>
                {outcomeData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;