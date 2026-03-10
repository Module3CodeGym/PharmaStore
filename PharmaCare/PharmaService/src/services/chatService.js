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
  getDoc,
  where // Bổ sung where để lọc danh sách chat cho bệnh nhân
} from 'firebase/firestore';

// ----------------------------------------------------------------------
// 1. HÀM GỬI TIN NHẮN
// ----------------------------------------------------------------------
export const sendMessage = async (conversationId, senderId, text, userInfo = null) => {
  const chatRef = doc(db, 'chats', conversationId);
  const messagesRef = collection(chatRef, 'messages');

  try {
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      // TẠO MỚI PHÒNG CHAT: Bắt buộc phải lưu userId để Security Rules cho phép bệnh nhân đọc/sửa
      await setDoc(chatRef, {
        userId: senderId, // SỬA LỖI QUAN TRỌNG: Gắn ID của bệnh nhân vào phòng chat
        userInfo: userInfo, 
        createdAt: serverTimestamp(),
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        unreadCount: 1 
      });
    } else {
      // CẬP NHẬT PHÒNG CHAT: Chỉ cập nhật tin nhắn cuối cùng để nó nhảy lên đầu
      await updateDoc(chatRef, {
        lastMessage: text,
        lastMessageTime: serverTimestamp(),
        // Có thể thêm logic tăng unreadCount ở đây nếu cần thiết
      });
    }

    // THÊM TIN NHẮN CHI TIẾT
    await addDoc(messagesRef, {
      text: text,
      senderId: senderId,
      createdAt: serverTimestamp()
    });

  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
    throw error; // Ném lỗi ra để component gọi hàm có thể hiện Toast thông báo
  }
};

// ----------------------------------------------------------------------
// 2. HÀM LẮNG NGHE TIN NHẮN TRONG 1 PHÒNG (Dùng chung cho Bác sĩ & Bệnh nhân)
// ----------------------------------------------------------------------
export const listenToMessages = (conversationId, callback) => {
  const q = query(
    collection(db, 'chats', conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  }, (error) => {
    console.error("Lỗi lắng nghe tin nhắn trong phòng:", error);
  });
};

// ----------------------------------------------------------------------
// 3. HÀM LẮNG NGHE DANH SÁCH CHAT (Dành riêng cho Bác sĩ/Admin)
// ----------------------------------------------------------------------
export const listenToChatList = (callback) => {
  // Lấy tất cả các cuộc trò chuyện (Vì Rule cho phép Bác sĩ/Admin đọc mọi chat)
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
  }, (error) => {
    console.error("Lỗi lắng nghe danh sách chat bác sĩ:", error);
  });
};

// ----------------------------------------------------------------------
// 4. HÀM LẮNG NGHE DANH SÁCH CHAT CỦA BỆNH NHÂN (Tính năng mới an toàn)
// ----------------------------------------------------------------------
export const listenToUserChatList = (userId, callback) => {
  // Bệnh nhân chỉ được phép query những phòng chat có chứa userId của mình
  const q = query(
    collection(db, 'chats'),
    where('userId', '==', userId), // Lọc theo UID để không vi phạm Security Rules
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(chats);
  }, (error) => {
    console.error("Lỗi lắng nghe danh sách chat bệnh nhân:", error);
  });
};