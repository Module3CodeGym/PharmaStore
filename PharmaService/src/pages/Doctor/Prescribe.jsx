import React, { useState } from 'react';

const Prescribe = () => {
    // Data giả lập bệnh nhân chờ khám
    const waitingPatients = [
        { id: 1, name: "Lê Văn C", img: "https://via.placeholder.com/600x800?text=Don+Thuoc+Benh+Nhan+C", symp: "Đau dạ dày, ợ chua" },
        { id: 2, name: "Phạm Thị D", img: "https://via.placeholder.com/600x800?text=Don+Thuoc+Benh+Nhan+D", symp: "Sốt cao 39 độ" },
    ];
    
    // Kho thuốc
    const medicines = [
        { id: 1, ten: "Panadol Extra", gia: 2000, donvi: "Viên" },
        { id: 2, ten: "Gaviscon (Dạ dày)", gia: 5000, donvi: "Gói" },
        { id: 3, ten: "Kháng sinh Amox", gia: 3000, donvi: "Viên" },
    ];

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [cart, setCart] = useState([]);
    const [medId, setMedId] = useState("");
    const [qty, setQty] = useState(1);
    const [note, setNote] = useState("");

    const addToPrescription = () => {
        if (!medId) return alert("Chưa chọn thuốc!");
        const med = medicines.find(m => m.id === parseInt(medId));
        setCart([...cart, { ...med, qty, note }]);
        setQty(1); setNote("");
    };

    return (
        <div className="tab-container full-height">
            <div className="header-flex">
                <h2>📝 Tạo đơn thuốc điện tử</h2>
                <select 
                    style={{padding: '8px', width: '250px', border: '2px solid #0984e3', borderRadius: '4px'}}
                    onChange={(e) => {
                        const p = waitingPatients.find(wp => wp.id === parseInt(e.target.value));
                        setSelectedPatient(p); setCart([]);
                    }}
                >
                    <option value="">-- Chọn bệnh nhân chờ khám --</option>
                    {waitingPatients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>

            <div className="split-view">
                {/* TRÁI: ẢNH ĐƠN THUỐC */}
                <div className="view-left">
                    {selectedPatient ? (
                        <div style={{width:'100%', height:'100%', position:'relative'}}>
                            <div style={{position:'absolute', top:0, left:0, background:'rgba(0,0,0,0.6)', color:'white', padding:'5px', width:'100%'}}>
                                Triệu chứng: {selectedPatient.symp}
                            </div>
                            <img src={selectedPatient.img} alt="Don thuoc" style={{width:'100%', height:'100%', objectFit:'contain'}} />
                        </div>
                    ) : (
                        <div className="placeholder-img">
                            <i className="fas fa-image"></i>
                            <p>Vui lòng chọn bệnh nhân để hiển thị ảnh</p>
                        </div>
                    )}
                </div>

                {/* PHẢI: FORM KÊ ĐƠN */}
                <div className="view-right">
                    <h3>💊 Form Kê Đơn</h3>
                    <div className="form-group">
                        <label>Chọn thuốc:</label>
                        <select value={medId} onChange={(e)=>setMedId(e.target.value)}>
                            <option value="">-- Tìm kiếm thuốc --</option>
                            {medicines.map(m => <option key={m.id} value={m.id}>{m.ten} ({m.gia}đ/{m.donvi})</option>)}
                        </select>
                    </div>
                    <div style={{display:'flex', gap:'10px', marginBottom: '15px'}}>
                        <input type="number" min="1" value={qty} onChange={(e)=>setQty(e.target.value)} placeholder="SL" style={{width: '70px'}} />
                        <input type="text" value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Liều dùng (Sáng/Tối)..." style={{flex:1}} />
                    </div>
                    <button className="btn-add-med" onClick={addToPrescription}>⬇ Thêm thuốc</button>
                    
                    <div className="med-list-preview">
                        {cart.length === 0 ? <p style={{color:'#aaa', textAlign:'center', marginTop:'20px'}}>Danh sách trống...</p> : (
                            <ul style={{listStyle:'none', padding:0}}>
                                {cart.map((c, i) => (
                                    <li key={i} style={{borderBottom:'1px dashed #ccc', padding:'8px 0'}}>
                                        <b>{c.ten}</b> (x{c.qty}) - <i>{c.note}</i>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    <button className="btn-submit-pres" disabled={!selectedPatient} onClick={() => alert("Đã phát hành đơn!")}>
                        ✅ Phát hành đơn thuốc
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Prescribe;