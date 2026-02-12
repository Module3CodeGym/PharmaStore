import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../firebaseConfig'; 
import { onAuthStateChanged } from 'firebase/auth';
import { listenToMessages, sendMessage } from '../services/chatService'; // Import service vừa viết
import { sendNotification } from '../services/notificationService';
const UserChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false); // Trạng thái đóng/mở
  const [messages, setMessages] = useState([]); // List tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Nội dung đang nhập
  const [currentUser, setCurrentUser] = useState(null); // User hiện tại
  
  const messagesEndRef = useRef(null); // Dùng để tự cuộn xuống cuối

  // 1. Lấy thông tin người dùng đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 2. Lắng nghe tin nhắn Real-time (Nếu đã đăng nhập)
  useEffect(() => {
    if (currentUser) {
      // ID phòng chat luôn là: chat_ + UID của user
      const conversationId = `chat_${currentUser.uid}`;
      
      const unsubscribe = listenToMessages(conversationId, (data) => {
        setMessages(data);
        scrollToBottom();
      });
      return () => unsubscribe();
    }
  }, [currentUser, isOpen]); // Thêm isOpen để khi mở ra mới load tin nhắn cho nhẹ

  // Hàm tự cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 3. Xử lý gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const conversationId = `chat_${currentUser.uid}`;
    
    const userInfo = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || currentUser.email.split('@')[0],
      email: currentUser.email,
      photoURL: currentUser.photoURL || ""
    };

    // 1. Gửi tin nhắn vào Chat (Code cũ)
    await sendMessage(conversationId, currentUser.uid, newMessage, userInfo);
    
    // 2. --- THÊM ĐOẠN NÀY: Gửi thông báo cho Bác sĩ ---
    // Chỉ gửi thông báo, tiêu đề là tên khách, nội dung là tin nhắn vừa nhập
    await sendNotification(
      'message',                                      // Loại: tin nhắn
      `Tin nhắn từ ${userInfo.displayName}`,          // Tiêu đề
      newMessage,                                     // Nội dung: chính là cái khách vừa gõ
      '/doctor/chat'                                  // Link: bấm vào thì nhảy sang trang chat
    );
    // --------------------------------------------------

    setNewMessage(""); 
    scrollToBottom();
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      
      {/* --- PHẦN KHUNG CHAT (Hiện khi isOpen = true) --- */}
      {isOpen && (
        <div style={{
          width: '320px',
          height: '450px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '15px',
          overflow: 'hidden',
          border: '1px solid #ddd'
        }}>
          
          {/* Header */}
          <div style={{ background: '#0984e3', padding: '12px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>💬 Chat với Dược sĩ</span>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
          </div>

          {/* Nội dung tin nhắn */}
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f5f6fa', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentUser ? (
              messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.uid;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '15px',
                        background: isMe ? '#0984e3' : 'white',
                        color: isMe ? 'white' : '#333',
                        maxWidth: '80%',
                        wordWrap: 'break-word',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                        fontSize: '0.9rem'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: '#888', marginTop: '50px', fontSize: '0.9rem' }}>
                  <p>Xin chào! 👋</p>
                  <p>Bạn cần tư vấn thuốc gì không ạ?</p>
                </div>
              )
            ) : (
              <div style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>
                Vui lòng đăng nhập để chat.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập liệu */}
          {currentUser && (
            <form onSubmit={handleSend} style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', background: 'white' }}>
              <input 
                type="text" 
                placeholder="Nhập tin nhắn..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', fontSize: '0.9rem' }}
              />
              <button type="submit" style={{ background: '#0984e3', color: 'white', border: 'none', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer' }}>
                <i className="fas fa-paper-plane" style={{ fontSize: '0.8rem' }}></i>
              </button>
            </form>
          )}
        </div>
      )}

      {/* --- NÚT TRÒN MỞ CHAT --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#0984e3',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isOpen ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
      </button>

    </div>
  );
};

export default UserChatWidget;