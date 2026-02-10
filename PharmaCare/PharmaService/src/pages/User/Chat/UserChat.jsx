import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../../firebaseConfig'; 
import { 
  collection, query, orderBy, onSnapshot, 
  addDoc, serverTimestamp, setDoc, doc, updateDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { sendNotification } from '../../../services/notificationService'; // Nếu bạn muốn bắn thông báo cho bác sĩ
import './UserChat.css'; // File CSS riêng cho đẹp

const UserChat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Ref để tự cuộn xuống cuối
  const messagesEndRef = useRef(null);

  // 1. Lấy thông tin User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Lắng nghe tin nhắn Realtime
  useEffect(() => {
    if (!user) return;

    // ID cuộc trò chuyện = "chat_" + UID của user
    const conversationId = `chat_${user.uid}`;
    const messagesRef = collection(db, "chats", conversationId, "messages");
    
    // Sắp xếp tin nhắn theo thời gian tăng dần (cũ trên, mới dưới)
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user]);

  // Hàm cuộn xuống cuối
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const conversationId = `chat_${user.uid}`;
    const textToSend = newMessage;
    setNewMessage(""); // Xóa ô nhập ngay lập tức cho mượt

    try {
      // A. Lưu tin nhắn vào sub-collection
      await addDoc(collection(db, "chats", conversationId, "messages"), {
        text: textToSend,
        senderId: user.uid,
        createdAt: serverTimestamp(),
        senderName: user.displayName || user.email,
        isRead: false
      });

      // B. Cập nhật thông tin đoạn chat cha (để Bác sĩ thấy tin mới nhất ở list bên trái)
      const chatDocRef = doc(db, "chats", conversationId);
      
      const chatInfo = {
        lastMessage: textToSend,
        updatedAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || user.email,
        userAvatar: user.photoURL || "",
        isReadByDoctor: false // Đánh dấu để bác sĩ thấy chưa đọc
      };

      // Dùng setDoc với merge: true để tạo nếu chưa có, cập nhật nếu đã có
      await setDoc(chatDocRef, chatInfo, { merge: true });

      // C. (Tùy chọn) Gửi thông báo cho bác sĩ (nếu đã tích hợp Notification Service)
      // await sendNotification('message', `Tin nhắn từ ${user.displayName}`, textToSend, '/doctor/chat');

    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  // --- GIAO DIỆN ---
  if (loading) {
    return <div className="chat-loading">Đang tải cuộc trò chuyện...</div>;
  }

  if (!user) {
    return <div className="chat-require-login">Vui lòng đăng nhập để chat với bác sĩ.</div>;
  }

  return (
    <div className="user-chat-page">
      {/* Header Chat */}
      <div className="chat-header">
        <div className="doctor-info">
          <div className="doctor-avatar">
            <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Doctor" />
            <span className="online-dot"></span>
          </div>
          <div>
            <h3>Tư vấn trực tuyến</h3>
            <p>Bác sĩ đang sẵn sàng hỗ trợ bạn</p>
          </div>
        </div>
      </div>

      {/* Danh sách tin nhắn */}
      <div className="chat-body">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <img src="https://cdn-icons-png.flaticon.com/512/2665/2665448.png" alt="Chat" />
            <p>Hãy đặt câu hỏi, bác sĩ sẽ trả lời bạn sớm nhất!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.uid;
            return (
              <div key={msg.id} className={`message-row ${isMe ? 'my-message' : 'doctor-message'}`}>
                {!isMe && <div className="msg-avatar">👨‍⚕️</div>}
                <div className="message-bubble">
                  {msg.text}
                  <span className="message-time">
                    {msg.createdAt?.seconds 
                      ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
                      : '...'}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input gửi tin */}
      <form className="chat-footer" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Nhập nội dung cần tư vấn..." 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default UserChat;