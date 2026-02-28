import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import { 
  doc, getDoc, addDoc, collection, updateDoc, serverTimestamp 
} from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';

const DoctorExam = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  
  const [apptInfo, setApptInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dữ liệu phiếu khám
  const [examData, setExamData] = useState({
    symptoms: '',
    diagnosis: '',
    doctorNotes: ''
  });

  // 1. Lấy thông tin lịch hẹn
  useEffect(() => {
    const fetchAppt = async () => {
      try {
        const docRef = doc(db, "appointments", appointmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApptInfo({ id: docSnap.id, ...docSnap.data() });
        } else {
          toast.error("Không tìm thấy lịch khám!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppt();
  }, [appointmentId]);

  // 2. Xử lý lưu phiếu
  const handleSaveRecord = async () => {
    if (!examData.diagnosis || !examData.symptoms) {
      toast.warning("Vui lòng nhập đầy đủ Triệu chứng và Chẩn đoán!");
      return;
    }

    setIsSubmitting(true);

    try {
      // A. Tạo hồ sơ bệnh án
      await addDoc(collection(db, "medical_records"), {
        appointmentId: appointmentId,
        patientId: apptInfo.patientId,
        patientName: apptInfo.patientName,
        doctorId: apptInfo.doctorId,
        doctorName: apptInfo.doctorName,
        
        symptoms: examData.symptoms,
        diagnosis: examData.diagnosis,
        doctorNotes: examData.doctorNotes,
        
        status: "pending_pharmacist", // Gửi sang dược sĩ
        createdAt: serverTimestamp()
      });

      // B. Cập nhật lịch hẹn thành "Đã xong"
      await updateDoc(doc(db, "appointments", appointmentId), {
        status: "completed"
      });

      toast.success("Đã lưu kết quả & Gửi sang dược sĩ!");
      
      // Quay về danh sách sau 1.5s
      setTimeout(() => navigate('/doctor'), 1500);

    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Có lỗi xảy ra!");
      setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{padding: 20}}>Đang tải thông tin...</div>;

  return (
    <div className="doctor-exam-page" style={{ background: '#f5f6fa', minHeight: '100vh', padding: '40px 20px' }}>
      <ToastContainer />

      {/* Container căn giữa giống tờ giấy A4 */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        background: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
      }}>
        
        {/* HEADER CỦA PHIẾU */}
        <div style={{ borderBottom: '2px solid #00b894', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: '#2d3436', margin: 0, fontSize: '1.8rem' }}>Phiếu Kết Quả Khám Bệnh</h1>
            <p style={{ color: '#636e72', marginTop: '5px' }}>Mã hồ sơ: #{appointmentId.slice(0, 8).toUpperCase()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p><strong>Ngày khám:</strong> {new Date().toLocaleDateString('vi-VN')}</p>
            <p><strong>Bác sĩ:</strong> {apptInfo?.doctorName}</p>
          </div>
        </div>

        {/* THÔNG TIN BỆNH NHÂN */}
        <div style={{ background: '#f1f2f6', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0984e3' }}><i className="fas fa-user-injured"></i> Thông tin bệnh nhân</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
             <div><strong>Họ tên:</strong> {apptInfo?.patientName}</div>
             <div><strong>Mã BN:</strong> {apptInfo?.patientId?.slice(0,6)}...</div>
             <div style={{ gridColumn: '1 / -1' }}>
                <strong>Lý do khám / Ghi chú ban đầu:</strong> <br/>
                <span style={{ color: '#2d3436' }}>{apptInfo?.notes || "Không có ghi chú"}</span>
             </div>
          </div>
        </div>

        {/* FORM NHẬP LIỆU */}
        <div className="form-section">
          
          {/* 1. Triệu chứng */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#2d3436' }}>
              1. Triệu chứng lâm sàng <span style={{color: 'red'}}>*</span>
            </label>
            <textarea 
              rows="4" 
              placeholder="Mô tả chi tiết các triệu chứng bệnh nhân gặp phải..."
              value={examData.symptoms}
              onChange={(e) => setExamData({...examData, symptoms: e.target.value})}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '6px', 
                border: '1px solid #dfe6e9', fontSize: '1rem', fontFamily: 'inherit'
              }}
            />
          </div>

          {/* 2. Chẩn đoán */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#2d3436' }}>
              2. Chẩn đoán / Kết luận <span style={{color: 'red'}}>*</span>
            </label>
            <textarea 
              rows="3" 
              placeholder="Kết luận bệnh..."
              value={examData.diagnosis}
              onChange={(e) => setExamData({...examData, diagnosis: e.target.value})}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '6px', 
                border: '1px solid #dfe6e9', fontSize: '1rem', fontFamily: 'inherit'
              }}
            />
          </div>

          {/* 3. Ghi chú */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#2d3436' }}>
              3. Chỉ định thuốc & Ghi chú cho Dược sĩ
            </label>
            <textarea 
              rows="3" 
              placeholder="VD: Kê đơn kháng sinh nhóm A, lưu ý bệnh nhân có tiền sử đau dạ dày..."
              value={examData.doctorNotes}
              onChange={(e) => setExamData({...examData, doctorNotes: e.target.value})}
              style={{ 
                width: '100%', padding: '12px', borderRadius: '6px', 
                border: '1px solid #dfe6e9', fontSize: '1rem', fontFamily: 'inherit',
                backgroundColor: '#fffbe6', borderColor: '#ffe58f' // Màu vàng nhạt để lưu ý
              }}
            />
          </div>

          {/* BUTTON ACTIONS */}
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => navigate('/doctor')}
              style={{ 
                flex: 1, padding: '15px', background: '#b2bec3', 
                color: 'white', border: 'none', borderRadius: '8px', 
                fontWeight: 'bold', cursor: 'pointer' 
              }}
            >
              Hủy bỏ
            </button>

            <button 
              onClick={handleSaveRecord}
              disabled={isSubmitting}
              style={{ 
                flex: 2, padding: '15px', 
                background: isSubmitting ? '#a6e4d8' : '#00b894', 
                color: 'white', border: 'none', borderRadius: '8px', 
                fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}
            >
              {isSubmitting ? "Đang xử lý..." : "Lưu & Gửi Dược Sĩ"} <i className="fas fa-paper-plane"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorExam;