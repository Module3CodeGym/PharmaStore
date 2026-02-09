import React, { useState } from 'react';

const Chat = () => {
    const [activeUser, setActiveUser] = useState(1);
    const [input, setInput] = useState("");
    
    // Giả lập danh sách người cần tư vấn
    const users = [
        { id: 1, name: "Nguyễn Văn A", msg: "Bác sĩ ơi đau bụng quá..." }, 
        { id: 2, name: "Trần Thị B", msg: "Thuốc này uống sao ạ?" }
    ];

    // Giả lập tin nhắn
    const [messages, setMessages] = useState([
        { id: 1, sender: 'user', text: "Bác sĩ ơi, tôi đau bụng từ tối qua." },
        { id: 2, sender: 'me', text: "Chào bạn, đau ở vùng nào? Quanh rốn hay thượng vị?" }
    ]);

    const sendMsg = () => {
        if(!input.trim()) return;
        setMessages([...messages, { id: Date.now(), sender: 'me', text: input }]);
        setInput("");
    };

    return (
        <div className="tab-container chat-layout">
            {/* Danh sách bên trái */}
            <div className="chat-list">
                <h3>💬 Tin nhắn chờ</h3>
                <ul>
                    {users.map(u => (
                        <li key={u.id} className={activeUser === u.id ? 'active' : ''} onClick={() => setActiveUser(u.id)}>
                            <strong>{u.name}</strong>
                            <p style={{fontSize: '0.8rem', color: '#666', margin: 0}}>{u.msg}</p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Cửa sổ chat bên phải */}
            <div className="chat-window">
                <div className="chat-header">
                    <span>Đang tư vấn cho: <strong>{users.find(u => u.id === activeUser)?.name}</strong></span>
                    <button className="btn-call">📹 Video Call</button>
                </div>
                <div className="chat-messages">
                    {messages.map((m, i) => (
                        <p key={i} className={m.sender === 'user' ? 'msg-receive' : 'msg-sent'}>
                            {m.text}
                        </p>
                    ))}
                </div>
                <div className="chat-input">
                    <input 
                        value={input} 
                        onChange={(e)=>setInput(e.target.value)} 
                        onKeyPress={(e) => e.key === 'Enter' && sendMsg()}
                        placeholder="Nhập tư vấn..." 
                    />
                    <button onClick={sendMsg}>Gửi</button>
                </div>
            </div>
        </div>
    );
};
export default Chat;