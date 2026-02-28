import React, { useState } from 'react';
import '../../App.css'; 

const UploadPrescription = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý khi chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file)); // Tạo link ảo để xem trước
    }
  };

  // Giả lập gửi dữ liệu
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage || !symptoms) return alert("Vui lòng nhập đủ thông tin!");

    setIsSubmitting(true);
    
    // Giả lập độ trễ mạng 2 giây
    setTimeout(() => {
        setIsSubmitting(false);
        alert("✅ Đã gửi đơn thuốc thành công! Bác sĩ sẽ phản hồi sớm.");
        // Reset form
        setSelectedImage(null);
        setPreviewUrl("");
        setSymptoms("");
    }, 2000);
  };

  return (
    <div className="page-container" style={{maxWidth: '800px'}}>
      <h2 className="page-title" style={{textAlign: 'center'}}>📸 Gửi yêu cầu tư vấn & Mua thuốc</h2>
      
      <div style={{display: 'flex', gap: '30px', flexDirection: 'column-reverse', marginTop: '20px'}}>
        
        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} style={{background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)'}}>
            
            <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '10px', fontWeight: 'bold'}}>1. Tải ảnh đơn thuốc / Triệu chứng:</label>
                <div style={{border: '2px dashed #ccc', padding: '20px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', background: '#f9f9f9'}}>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} id="file-upload" />
                    <label htmlFor="file-upload" style={{cursor: 'pointer', display: 'block', width: '100%', height: '100%'}}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" style={{maxHeight: '200px', borderRadius: '8px'}} />
                        ) : (
                            <div style={{padding: '20px'}}>
                                <i className="fas fa-cloud-upload-alt" style={{fontSize: '3rem', color: '#ccc'}}></i>
                                <p style={{color: '#666', marginTop: '10px'}}>Bấm để chọn ảnh từ máy</p>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '10px', fontWeight: 'bold'}}>2. Mô tả triệu chứng (nếu có):</label>
                <textarea 
                    className="form-input" 
                    rows="4" 
                    placeholder="Ví dụ: Tôi bị ho 3 ngày nay, có đờm..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    style={{width: '100%'}}
                ></textarea>
            </div>

            <button 
                type="submit" 
                className="btn btn-primary" 
                style={{width: '100%', padding: '15px', fontSize: '1.1rem'}}
                disabled={isSubmitting}
            >
                {isSubmitting ? "⏳ Đang gửi..." : "🚀 Gửi yêu cầu ngay"}
            </button>
        </form>

        {/* Hướng dẫn (Optional) */}
        <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #2196f3'}}>
            <h4>💡 Quy trình mua thuốc online:</h4>
            <ul style={{marginLeft: '20px', marginTop: '10px', lineHeight: '1.8'}}>
                <li>Bước 1: Chụp ảnh đơn thuốc rõ nét hoặc mô tả bệnh.</li>
                <li>Bước 2: Bác sĩ chuyên khoa sẽ xem và kê đơn (khoảng 15 phút).</li>
                <li>Bước 3: Bạn nhận thông báo, xác nhận đơn hàng và thanh toán.</li>
                <li>Bước 4: Thuốc được giao tận nhà (2-4h).</li>
            </ul>
        </div>

      </div>
    </div>
  );
};

export default UploadPrescription;