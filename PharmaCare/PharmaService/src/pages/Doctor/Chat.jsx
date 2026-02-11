import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebaseConfig'; 
import { 
  collection, query, orderBy, onSnapshot, 
  addDoc, serverTimestamp, doc, updateDoc, where 
} from 'firebase/firestore';
import './Chat.css';

const DoctorChat = () => {
  const [chats, setChats] = useState([]); // Danh sách người cần tư vấn
  const [selectedChat, setSelectedChat] = useState(null); // Cuộc trò chuyện đang chọn
  const [messages, setMessages] = useState([]); // Tin nhắn chi tiết
  const [newMessage, setNewMessage] = useState("");
  
  const messagesEndRef = useRef(null);

  // --- 1. LẤY DANH SÁCH CHAT (SIDEBAR) ---
  useEffect(() => {
    // Sắp xếp theo 'updatedAt' giảm dần (desc) -> Tin mới nhất lên đầu
    const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. LẤY TIN NHẮN CỦA CHAT ĐANG CHỌN ---
  useEffect(() => {
    if (!selectedChat) return;

    // Đánh dấu đã đọc khi bác sĩ bấm vào xem (nếu chưa đọc)
    if (!selectedChat.isReadByDoctor) {
      const chatRef = doc(db, "chats", selectedChat.id);
      // Chỉ update trên Firebase, state local sẽ tự update nhờ onSnapshot ở trên
      updateDoc(chatRef, { isReadByDoctor: true }).catch(err => console.error(err));
    }

    const messagesRef = collection(db, "chats", selectedChat.id, "messages");
    // Tin nhắn cũ ở trên, mới ở dưới (asc)
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [selectedChat]); // Chạy lại khi đổi chat khác

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // --- 3. HÀM XỬ LÝ THỜI GIAN (Fix lỗi hiển thị) ---
  const formatTime = (timestamp) => {
    if (!timestamp) return '...'; // Đang gửi...
    
    // Nếu là Firestore Timestamp (có seconds)
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleTimeString('vi-VN', {
        hour: '2-digit', 
        minute:'2-digit'
      });
    }
    // Nếu là Date object thường (fallback)
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit', 
      minute:'2-digit'
    });
  };

  // --- 4. GỬI TIN NHẮN ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const textToSend = newMessage;
    setNewMessage(""); // Xóa ô nhập ngay

    try {
      // A. Thêm tin nhắn vào sub-collection
      await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
        text: textToSend,
        senderId: "DOCTOR", // Hoặc auth.currentUser.uid
        createdAt: serverTimestamp(),
        isRead: false
      });

      // B. Cập nhật trạng thái ra ngoài (Để nhảy lên đầu list)
      const chatRef = doc(db, "chats", selectedChat.id);
      await updateDoc(chatRef, {
        lastMessage: textToSend,
        updatedAt: serverTimestamp(), // QUAN TRỌNG: Cập nhật giờ để sort
        isReadByDoctor: true // Bác sĩ nhắn thì đương nhiên đã đọc
      });

    } catch (error) {
      console.error("Lỗi gửi tin:", error);
    }
  };

  return (
    <div className="doctor-chat-container">
      
      {/* --- SIDEBAR TRÁI: DANH SÁCH --- */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Tư vấn bệnh nhân</h3>
        </div>
        <div className="chat-list">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <img 
                src={chat.userAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                alt="User" 
                className="chat-avatar"
              />
              <div className="chat-info">
                <div className="chat-name-row">
                  {/* Nếu chưa đọc: Tên in đậm (class unread-name) */}
                  <span className={`chat-name ${!chat.isReadByDoctor ? 'unread-name' : ''}`}>
                    {chat.userName || "Khách hàng"}
                  </span>
                  <span className="chat-time">{formatTime(chat.updatedAt)}</span>
                </div>
                
                <div className="chat-preview-row">
                  {/* Nếu chưa đọc: Nội dung in đậm (class bold-text) */}
                  <p className={`chat-preview ${!chat.isReadByDoctor ? 'bold-text' : ''}`}>
                    {/* Thêm icon phong bì nếu chưa đọc */}
                    {!chat.isReadByDoctor && "📩 "} 
                    {chat.lastMessage}
                  </p>
                  
                  {/* Nếu chưa đọc: Hiện chấm đỏ */}
                  {!chat.isReadByDoctor && <span className="unread-dot"></span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- KHUNG CHAT PHẢI --- */}
      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-main-header">
              <img src={selectedChat.userAvatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="Avatar" />
              <h4>{selectedChat.userName}</h4>
            </div>

            <div className="chat-messages">
              {messages.map(msg => {
                const isMe = msg.senderId === "DOCTOR" || msg.senderId === auth.currentUser?.uid;
                return (
                  <div key={msg.id} className={`message-row ${isMe ? 'doctor-msg' : 'user-msg'}`}>
                    <div className="message-bubble">
                      {msg.text}
                      <span className="msg-time">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
              <input 
                type="text" 
                placeholder="Nhập tin nhắn..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit"><i className="fas fa-paper-plane"></i></button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <i className="fas fa-comments" style={{fontSize: '50px', color: '#ccc'}}></i>
            <p>Chọn một bệnh nhân để bắt đầu tư vấn</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;