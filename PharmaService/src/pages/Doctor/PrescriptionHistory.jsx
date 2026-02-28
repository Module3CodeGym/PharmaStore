import React from "react";
import "../../App.css";

const PrescriptionHistory = () => {
  // MOCK DATA
  const history = [
    {
      id: 1,
      patient: "Nguyễn Văn A",
      status: "da_duyet",
      time: "02/02/2025 10:30",
    },
    {
      id: 2,
      patient: "Trần Thị B",
      status: "tu_choi",
      time: "01/02/2025 14:20",
    },
  ];

  const renderStatus = (status) => {
    if (status === "da_duyet")
      return <span style={{ color: "#00b894", fontWeight: "bold" }}>Đã duyệt</span>;
    return <span style={{ color: "#d63031", fontWeight: "bold" }}>Từ chối</span>;
  };

  return (
    <div className="doctor-container page-container">
      <h2 className="page-title">📚 Lịch sử duyệt đơn</h2>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Trạng thái</th>
              <th>Thời gian duyệt</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.patient}</td>
                <td>{renderStatus(item.status)}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrescriptionHistory;
