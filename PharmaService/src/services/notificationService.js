import { db } from '../firebaseConfig';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

// 1. HÀM GỬI THÔNG BÁO (Dùng ở trang Khách hàng)
// type: 'message' | 'order' | 'system'
export const sendNotification = async (type, title, message, link = '') => {
  try {
    await addDoc(collection(db, 'notifications'), {
      type: type,          // Loại thông báo
      title: title,        // Tiêu đề (VD: Tin nhắn mới)
      message: message,    // Nội dung ngắn
      link: link,          // Đường dẫn khi bấm vào (VD: /doctor/chat)
      isRead: false,       // Trạng thái chưa đọc
      target: 'doctor',    // Gửi cho ai (doctor/admin)
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Lỗi gửi thông báo:", error);
  }
};

// 2. HÀM ĐÁNH DẤU ĐÃ ĐỌC (Dùng khi Bác sĩ bấm vào xem)
export const markAsRead = async (notificationId) => {
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, {
      isRead: true
    });
  } catch (error) {
    console.error("Lỗi đánh dấu đã đọc:", error);
  }
};

// 3. HÀM LẮNG NGHE THÔNG BÁO (Dùng cho cái Chuông)
export const listenToNotifications = (callback) => {
  // Lấy thông báo dành cho doctor, sắp xếp mới nhất
  const q = query(
    collection(db, 'notifications'),
    where('target', '==', 'doctor'),
    orderBy('createdAt', 'desc'),
    limit(20) // Chỉ lấy 20 thông báo gần nhất
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
};