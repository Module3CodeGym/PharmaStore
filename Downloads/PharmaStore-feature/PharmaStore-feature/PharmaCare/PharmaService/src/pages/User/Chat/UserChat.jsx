import React, { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../../firebaseConfig'; 
import { 
  collection, query, orderBy, onSnapshot, 
  addDoc, serverTimestamp, setDoc, doc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './UserChat.css';

const UserChat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // --- 1. SỬA: Dùng Ref trỏ vào khung body thay vì div rỗng ---
  const chatBodyRef = useRef(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const conversationId = `chat_${user.uid}`;
    const messagesRef = collection(db, "chats", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // --- 2. SỬA: Hàm cuộn chỉ tác động vào khung chat ---
  useEffect(() => {
    if (chatBodyRef.current) {
      // Cách này chỉ cuộn nội dung bên trong div, không kéo cả trang xuống
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth" // Cuộn mượt
      });
    }
  }, [messages]); // Chạy mỗi khi có tin nhắn mới

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const textToSend = newMessage;
    setNewMessage(""); // Xóa ô nhập liệu ngay lập tức
    
    // ... (Code gửi tin nhắn giữ nguyên như cũ) ...
    const conversationId = `chat_${user.uid}`;
    try {
      await addDoc(collection(db, "chats", conversationId, "messages"), {
        text: textToSend,
        senderId: user.uid,
        createdAt: serverTimestamp(),
        senderName: user.displayName || user.email,
        isRead: false
      });

      const chatDocRef = doc(db, "chats", conversationId);
      await setDoc(chatDocRef, {
        lastMessage: textToSend,
        updatedAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || user.email,
        userAvatar: user.photoURL || "",
        isReadByDoctor: false
      }, { merge: true });

    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
    }
  };

  if (loading) return <div className="chat-loading">Đang tải...</div>;
  if (!user) return <div className="chat-require-login">Vui lòng đăng nhập.</div>;

  return (
    <div className="user-chat-page">
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

      {/* --- 3. SỬA: Gắn Ref vào đây --- */}
      <div className="chat-body" ref={chatBodyRef}>
        {messages.length === 0 ? (
          <div className="empty-chat">
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
        {/* Đã XÓA cái div <div ref={messagesEndRef} /> vì không cần nữa */}
      </div>

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