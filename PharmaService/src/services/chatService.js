import { db } from '../firebaseConfig'; // Đảm bảo đường dẫn trỏ đúng về file config của bạn
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  setDoc, 
  serverTimestamp, 
  getDoc 
} from 'firebase/firestore';

export const sendMessage = async (conversationId, senderId, text, userInfo = null) => {
  // 1. Xác định vị trí lưu: chats -> [ID cuộc trò chuyện]
  const chatRef = doc(db, 'chats', conversationId);
  
  // 2. Xác định vị trí lưu tin nhắn chi tiết: chats -> [ID] -> messages
  const messagesRef = collection(chatRef, 'messages');

  try {
    // 3. Kiểm tra xem cuộc trò chuyện này đã tồn tại chưa
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      // Nếu chưa có (Khách nhắn tin đầu tiên) -> Tạo mới document cha
      await setDoc(chatRef, {
        userInfo: userInfo, // Lưu thông tin khách (Tên, Avatar...) để Bác sĩ thấy
        createdAt: serverTimestamp(),
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        unreadCount: 1 // Đánh dấu là có tin mới
      });
    } else {
      // Nếu đã có -> Chỉ cập nhật tin nhắn cuối cùng để nó nhảy lên đầu
      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        // Nếu người gửi là User thì tăng biến đếm tin chưa đọc cho bác sĩ (tùy chọn logic sau này)
      });
    }

    // 4. Thêm tin nhắn mới vào sub-collection 'messages'
    await addDoc(messagesRef, {
      text: text,
      senderId: senderId,
      createdAt: serverTimestamp()
    });

  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
  }
};

// ----------------------------------------------------------------------
// 2. HÀM LẮNG NGHE TIN NHẮN (Real-time) - Dùng để hiện khung chat
// ----------------------------------------------------------------------
export const listenToMessages = (conversationId, callback) => {
  // Lấy danh sách tin nhắn, sắp xếp theo thời gian tăng dần (cũ trên, mới dưới)
  const q = query(
    collection(db, 'chats', conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  // onSnapshot: Tự động chạy lại mỗi khi có tin nhắn mới
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  });
};

// ----------------------------------------------------------------------
// 3. HÀM LẮNG NGHE DANH SÁCH CHAT (Dành riêng cho Bác sĩ)
// ----------------------------------------------------------------------
export const listenToChatList = (callback) => {
  // Lấy tất cả các cuộc trò chuyện, sắp xếp theo thời gian tin nhắn cuối cùng (mới nhất lên đầu)
  const q = query(
    collection(db, 'chats'),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  });
};