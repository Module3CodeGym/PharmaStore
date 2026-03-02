import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const DoctorRatingForm = ({ doctorId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      await addDoc(collection(db, "reviews"), {
        doctorId: doctorId,
        patientId: auth.currentUser.uid,
        patientName: auth.currentUser.displayName,
        rating: Number(rating),
        comment: comment,
        createdAt: serverTimestamp()
      });
      alert("Cảm ơn bạn đã đánh giá!");
    } catch (error) {
      console.error("Lỗi gửi đánh giá:", error);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
      <h4>Đánh giá bác sĩ</h4>
      <select value={rating} onChange={(e) => setRating(e.target.value)}>
        {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Sao</option>)}
      </select>
      <textarea 
        placeholder="Nhập nhận xét..." 
        value={comment} 
        onChange={(e) => setComment(e.target.value)} 
      />
      <button onClick={submitReview}>Gửi đánh giá</button>
    </div>
  );
};