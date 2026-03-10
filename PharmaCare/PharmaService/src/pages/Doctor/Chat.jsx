import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebaseConfig'; 
import { 
  collection, query, orderBy, onSnapshot, 
  addDoc, serverTimestamp, doc, updateDoc, where 
} from 'firebase/firestore';
import './Chat.css';

const DoctorChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  
  const messagesEndRef = useRef(null);

  // --- 1. LẤY DANH SÁCH CHAT (Cập nhật logic Unsubscribe chuẩn) ---
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, "chats"), orderBy("lastMessageTime", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
    }, (error) => {
      console.error("Lỗi Rules Sidebar:", error.code);
    });

    return () => unsubscribe();
  }, []);

  // --- 2. LẤY TIN NHẮN (Fix lỗi hiển thị và Permission) ---
  useEffect(() => {
    if (!selectedChat) return;

    // Đánh dấu đã đọc an toàn
    const markAsRead = async () => {
      if (!selectedChat.isReadByDoctor) {
        try {
          const chatRef = doc(db, "chats", selectedChat.id);
          await updateDoc(chatRef, { isReadByDoctor: true });
        } catch (err) {
          console.error("Rules chặn đánh dấu đã đọc:", err.code);
        }
      }
    };
    markAsRead();

    const messagesRef = collection(db, "chats", selectedChat.id, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    // Lắng nghe tin nhắn với hàm dọn dẹp để tránh lỗi snapshot listener
    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      setTimeout(scrollToBottom, 100); // Đợi DOM render rồi scroll
    }, (error) => {
      console.error("Lỗi Rules tin nhắn:", error.code);
    });

    return () => unsubscribeMessages();
  }, [selectedChat?.id]); // Chỉ chạy lại khi ID chat thay đổi thực sự

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '...';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute:'2-digit' });
  };

  // --- 4. GỬI TIN NHẮN (Sử dụng UID thực tế của Bác sĩ) ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !auth.currentUser) return;

    const textToSend = newMessage;
    const currentChatId = selectedChat.id;
    setNewMessage("");

    try {
      // Dùng UID thật để Rules cho phép write
      await addDoc(collection(db, "chats", currentChatId, "messages"), {
        text: textToSend,
        senderId: auth.currentUser.uid, 
        createdAt: serverTimestamp(),
        isRead: false
      });

      await updateDoc(doc(db, "chats", currentChatId), {
        lastMessage: textToSend,
        updatedAt: serverTimestamp(),
        isReadByDoctor: true,
        isReadByUser: false // Thông báo cho bệnh nhân có tin mới
      });

    } catch (error) {
      console.error("Lỗi gửi tin (Kiểm tra Rules):", error.code);
    }
  };

  return (
    <div className="doctor-chat-container">
      <div className="chat-sidebar">
        <div className="sidebar-header"><h3>Tư vấn bệnh nhân</h3></div>
        {/* --- SIDEBAR TRÁI: DANH SÁCH --- */}
<div className="chat-list">
  {chats.map(chat => (
    <div 
      key={chat.id} 
      className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
      onClick={() => setSelectedChat(chat)}
    >
      {/* CẬP NHẬT: Lấy ảnh từ userInfo.photoURL */}
      <img 
        src={chat.userInfo?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
        alt="User" 
        className="chat-avatar" 
      />
      <div className="chat-info">
        <div className="chat-name-row">
          {/* CẬP NHẬT: Lấy tên từ userInfo.displayName */}
          <span className={`chat-name ${!chat.isReadByDoctor ? 'unread-name' : ''}`}>
            {chat.userInfo?.displayName || "Khách hàng"}
          </span>
          <span className="chat-time">{formatTime(chat.lastMessageTime)}</span>
        </div>
        <div className="chat-preview-row">
          <p className={`chat-preview ${!chat.isReadByDoctor ? 'bold-text' : ''}`}>
            {!chat.isReadByDoctor && "📩 "}{chat.lastMessage}
          </p>
          {!chat.isReadByDoctor && <span className="unread-dot"></span>}
        </div>
      </div>
    </div>
  ))}
</div>
      </div>

      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-main-header">
              <img 
          src={selectedChat.userInfo?.photoURL || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
          alt="Avatar" 
        />
<h4>{selectedChat.userInfo?.displayName || "Bệnh nhân"}</h4>            </div>
            <div className="chat-messages">
              {messages.map(msg => {
                // Kiểm tra người gửi là chính bác sĩ đang đăng nhập
                const isMe = msg.senderId === auth.currentUser?.uid;
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
              <input type="text" placeholder="Nhập tin nhắn..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
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