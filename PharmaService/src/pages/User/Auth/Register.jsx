import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-card">
      <h2>Đăng ký</h2>
      <input placeholder="Email" />
      <input placeholder="Mật khẩu" />
      <button className="btn-save" onClick={() => navigate("/user/login")}>
        Tạo tài khoản
      </button>
    </div>
  );
}
