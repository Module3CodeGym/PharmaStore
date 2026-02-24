# 🏥 PharmaCare - Hệ thống quản lý Nhà thuốc Thông minh

Hệ thống quản lý nhà thuốc toàn diện bao gồm giao diện Khách hàng, Bác sĩ, Dược sĩ và Admin. Dự án được phát triển nhằm tối ưu hóa quy trình kê đơn, quản lý kho hàng và chăm sóc sức khỏe.

---

## 🛠 Công nghệ & Ngôn ngữ sử dụng

Dự án được xây dựng dựa trên các công nghệ hiện đại nhằm đảm bảo hiệu năng và khả năng mở rộng:

- **Ngôn ngữ:** JavaScript (ES6+), HTML5, CSS3.
- **Framework:** [ReactJS](https://reactjs.org/) (v18.3).
- **Công cụ Build:** [Vite](https://vitejs.dev/) (Cực nhanh và nhẹ).
- **Backend/Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore).
- **UI Framework:** [React Bootstrap](https://react-bootstrap.github.io/) (v5).
- **Icons:** [React Icons](https://react-icons.github.io/react-icons/) (FontAwesome, Material Design).
- **Biểu đồ:** [Recharts](https://recharts.org/) (Dành cho Dashboard).
- **Thông báo:** [React Toastify](https://fkhadra.github.io/react-toastify/introduction).

---

## 🧩 Extension cần thiết cho VS Code

Để có trải nghiệm phát triển tốt nhất và giữ mã nguồn sạch đẹp, bạn nên cài đặt các Extension sau:

1.  **ESLint:** Kiểm tra lỗi cú pháp và quy chuẩn code (Project đã cấu hình sẵn file `.eslintrc.cjs`).
2.  **Prettier - Code formatter:** Tự động định dạng code khi lưu file.
3.  **ES7+ React/Redux/React-Native snippets:** Gợi ý code React nhanh (Gõ `rfce` để tạo component).
4.  **Auto Close Tag / Auto Rename Tag:** Tự động đóng/đổi tên thẻ HTML/JSX.
5.  **Path Intellisense:** Tự động gợi ý đường dẫn file khi `import`.

**Cách tải:**

1. Mở VS Code -> Nhấn `Ctrl + Shift + X` (hoặc icon Extensions bên trái).
2. Nhập tên Extension vào ô tìm kiếm.
3. Nhấn **Install**.

---

## 🔐 Tài khoản mẫu & Luồng chuyển hướng

Hệ thống đã được hợp nhất luồng đăng nhập tại trang `/login`. Dưới đây là các tài khoản dùng để kiểm thử:

| Vai trò               | Email đăng nhập         | Mật khẩu | Trang chuyển hướng sau Login |
| :-------------------- | :---------------------- | :------- | :--------------------------- |
| **Admin**             | `admin@gmail.com`       | `123`    | `/admin`                     |
| **Nhân viên (Staff)** | `staff@gmail.com`       | `123`    | `/pharmacist/dashboard`      |
| **Người dùng (User)** | `user@gmail.com`        | `123`    | `/` (Trang chủ)              |
| **Bác sĩ (Doctor)**   | `doctor@pharmacare.com` | `123`    | `/doctor`                    |

> [!NOTE]
> Tài khoản Staff (Dược sĩ) sẽ tự động được điều hướng vào bảng điều khiển Dược sĩ thay vì Admin Panel.

---

## 🚀 Cách chạy dự án

1. **Cài đặt thư viện:**

   ```bash
   npm install
   ```

2. **Chạy chế độ Development:**

   ```bash
   npm run dev
   ```

3. **Build dự án:**
   ```bash
   npm run build
   ```
