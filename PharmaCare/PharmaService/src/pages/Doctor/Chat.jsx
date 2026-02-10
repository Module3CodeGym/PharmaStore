import React, { useState, useEffect, useRef } from 'react';
import { auth } from '../../firebaseConfig'; 
import { listenToChatList, listenToMessages, sendMessage } from '../../services/chatService';

const DoctorChat = () => {
  const [chats, setChats] = useState([]); // Danh sách người cần tư vấn
  const [selectedChat, setSelectedChat] = useState(null); // Người đang chọn để chat
  const [messages, setMessages] = useState([]); // Nội dung chat chi tiết
  const [replyText, setReplyText] = useState(""); // Nội dung trả lời
  
  const messagesEndRef = useRef(null);

  // 1. Lấy danh sách tất cả các cuộc hội thoại
  useEffect(() => {
    const unsubscribe = listenToChatList((data) => {
      setChats(data);
    });
    return () => unsubscribe();
  }, []);

  // 2. Khi bấm chọn 1 người -> Lấy nội dung tin nhắn của người đó
  useEffect(() => {
    if (selectedChat) {
      const unsubscribe = listenToMessages(selectedChat.id, (data) => {
        setMessages(data);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
      return () => unsubscribe();
    }
  }, [selectedChat]);

  // 3. Gửi tin nhắn trả lời
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedChat) return;

    const doctorId = auth.currentUser?.uid || "doctor_id_tam_thoi"; // Lấy UID bác sĩ

    // Gửi tin nhắn (senderId là bác sĩ)
    await sendMessage(selectedChat.id, doctorId, replyText, null);
    
    setReplyText("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="container-fluid p-0" style={{ height: '90vh', display: 'flex', background: '#f8f9fa' }}>
      
      {/* --- CỘT TRÁI: DANH SÁCH KHÁCH HÀNG --- */}
      <div style={{ width: '350px', background: 'white', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <div className="p-3 bg-primary text-white font-weight-bold">
          <i className="fas fa-user-md"></i> Danh sách tư vấn
        </div>
        
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => setSelectedChat(chat)}
            style={{ 
              padding: '15px', 
              borderBottom: '1px solid #eee', 
              cursor: 'pointer',
              background: selectedChat?.id === chat.id ? '#e3f2fd' : 'white',
              transition: '0.2s'
            }}
          >
            <div style={{ fontWeight: 'bold', color: '#333' }}>
              {chat.userInfo?.displayName || "Khách ẩn danh"}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {/* Nếu tin nhắn chưa đọc thì tô đậm (ví dụ) */}
              {chat.lastMessage}
            </div>
            <small style={{ color: '#999', fontSize: '0.8rem' }}>
                {chat.lastMessageTime?.seconds ? new Date(chat.lastMessageTime.seconds * 1000).toLocaleTimeString() : ''}
            </small>
          </div>
        ))}
      </div>

      {/* --- CỘT PHẢI: KHUNG CHAT --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChat ? (
          <>
            {/* Header tên khách */}
            <div className="p-3 border-bottom bg-white d-flex align-items-center justify-content-between">
              <strong>Đang chat với: <span className="text-primary">{selectedChat.userInfo?.displayName}</span></strong>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setSelectedChat(null)}>Đóng</button>
            </div>

            {/* Nội dung tin nhắn */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f0f2f5' }}>
              {messages.map((msg) => {
                // Kiểm tra xem tin nhắn này là của Bác sĩ (chính mình) hay Khách
                const isDoctor = msg.senderId === auth.currentUser?.uid; 
                
                return (
                  <div key={msg.id} style={{ 
                    display: 'flex', 
                    justifyContent: isDoctor ? 'flex-end' : 'flex-start',
                    marginBottom: '10px'
                  }}>
                    <div style={{ 
                      padding: '10px 15px', 
                      borderRadius: '15px',
                      background: isDoctor ? '#007bff' : 'white', // Bác sĩ màu xanh, Khách màu trắng
                      color: isDoctor ? 'white' : '#333',
                      maxWidth: '70%',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập liệu */}
            <form onSubmit={handleReply} className="p-3 bg-white border-top d-flex gap-2">
              <input 
                type="text" 
                className="form-control"
                placeholder="Nhập câu trả lời..." 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary px-4"><i className="fas fa-paper-plane"></i></button>
            </form>
          </>
        ) : (
          // Màn hình chờ khi chưa chọn ai
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', flexDirection: 'column' }}>
            <i className="fas fa-comments" style={{ fontSize: '4rem', marginBottom: '20px', color: '#ddd' }}></i>
            <h4>Chọn một khách hàng để bắt đầu tư vấn</h4>
          </div>
        )}
      </div>

    </div>
  );
};

export default DoctorChat;