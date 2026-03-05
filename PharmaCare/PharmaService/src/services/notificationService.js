import { db, auth } from '../firebaseConfig';
import { 
  collection, addDoc, updateDoc, doc, 
  serverTimestamp, query, where, orderBy, limit, onSnapshot 
} from 'firebase/firestore';

// 1. HÀM GỬI THÔNG BÁO (Fix: Thêm recipientId để Rules nhận diện)
export const sendNotification = async (recipientId, type, title, message, link = '') => {
  if (!recipientId) return;
  try {
    await addDoc(collection(db, 'notifications'), {
      userId: recipientId,    // BẮT BUỘC: Để Rules kiểm tra quyền sở hữu
      type: type,             
      title: title,           
      message: message,       
      link: link,             
      isRead: false,          
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error("Lỗi gửi thông báo:", error);
  }
};

// 2. HÀM ĐÁNH DẤU ĐÃ ĐỌC (Fix lỗi notificationService.js:30)
export const markAsRead = async (notificationId) => {
  try {
    // Chỉ thực hiện nếu có user đang đăng nhập
    if (!auth.currentUser) return;
    
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, {
      isRead: true
    });
  } catch (error) {
    // Nếu vẫn lỗi, hãy kiểm tra Rules xem có cho phép Bác sĩ sửa thông báo của Bệnh nhân không
    console.error("Lỗi đánh dấu đã đọc:", error);
  }
};

// 3. HÀM LẮNG NGHE THÔNG BÁO (Fix lỗi snapshot listener)
export const listenToNotifications = (callback) => {
  if (!auth.currentUser) return () => {};

  // Lấy thông báo theo userId của người đang đăng nhập (khớp với Rule số 9)
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', auth.currentUser.uid), // Thay 'target' bằng 'userId'
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  }, (error) => {
    // Bắt lỗi để không bị đỏ Console
    console.error("Lỗi Permission Listener:", error.code);
  });
};