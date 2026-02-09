import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import '../../App.css'; // Dùng lại CSS cũ

const DoctorDashboard = () => {
  // 1. SỐ LIỆU TỔNG QUAN (CARDS)
  const stats = [
    { title: "Tổng đơn thuốc", value: "1,204", icon: "💊", color: "#0984e3" },
    { title: "Chờ xử lý", value: "12", icon: "⏳", color: "#e17055" },
    { title: "Bệnh nhân mới", value: "45", icon: "users", color: "#00b894" },
    { title: "Doanh thu tháng", value: "125.4tr", icon: "💰", color: "#6c5ce7" },
  ];

  // 2. DỮ LIỆU BIỂU ĐỒ DOANH THU (LINE CHART)
  const revenueData = [
    { name: 'T1', doanh_thu: 40, don_hang: 24 },
    { name: 'T2', doanh_thu: 30, don_hang: 13 },
    { name: 'T3', doanh_thu: 20, don_hang: 58 },
    { name: 'T4', doanh_thu: 27, don_hang: 39 },
    { name: 'T5', doanh_thu: 18, don_hang: 48 },
    { name: 'T6', doanh_thu: 23, don_hang: 38 },
    { name: 'T7', doanh_thu: 34, don_hang: 43 },
  ];

  // 3. DỮ LIỆU TRẠNG THÁI ĐƠN (PIE CHART)
  const statusData = [
    { name: 'Đã hoàn thành', value: 400 },
    { name: 'Đang giao', value: 300 },
    { name: 'Chờ duyệt', value: 100 },
    { name: 'Đã hủy', value: 50 },
  ];
  const COLORS = ['#00b894', '#0984e3', '#fdcb6e', '#d63031'];

  return (
    <div className="doctor-container page-container">
      <h2 className="page-title">📊 Báo cáo thống kê</h2>

      {/* --- PHẦN 1: CARDS THỐNG KÊ --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {stats.map((item, index) => (
          <div key={index} style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '10px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderLeft: `5px solid ${item.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{ color: '#636e72', fontSize: '0.9rem', marginBottom: '5px' }}>{item.title}</p>
              <h3 style={{ fontSize: '1.8rem', color: '#2d3436', margin: 0 }}>{item.value}</h3>
            </div>
            <div style={{ fontSize: '2rem', opacity: 0.8 }}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* --- PHẦN 2: BIỂU ĐỒ --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* Biểu đồ Doanh thu (Line Chart) */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h4 style={{ marginBottom: '20px', color: '#2d3436' }}>📈 Xu hướng doanh thu & Đơn hàng</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="doanh_thu" name="Doanh thu (Tr)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="don_hang" name="Số đơn" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ Tròn (Pie Chart) */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h4 style={{ marginBottom: '20px', color: '#2d3436' }}>Tỉ lệ đơn thuốc</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.9rem', color: '#636e72' }}>
            <i>Phân bố trạng thái đơn hàng trong tháng</i>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;