# PharmaCare - Hệ Thống Quản Lý Nhà Thuốc Hiện Đại

PharmaCare là một ứng dụng quản lý nhà thuốc toàn diện được xây dựng bằng ReactJS, tập trung vào trải nghiệm người dùng hiện đại, giao diện tinh tế và quy trình quản lý chặt chẽ.

## 🚀 Tính Năng Chính

### 1. Dashboard Tổng Quan

- Biểu đồ doanh thu trực quan (Chart.js).
- Thống kê nhanh: doanh thu, đơn hàng mới, sản phẩm sắp hết hạn/hết hàng.
- Widget cảnh báo thông minh các lô hàng cần chú ý.

### 2. Quản Lý Sản Phẩm & Kho Hàng

- Quản lý thông tin chi tiết thuốc (Hoạt chất, hàm lượng, quy cách).
- **Quản lý theo Lô (Batch)**: Theo dõi hạn sử dụng và vị trí lưu kho từng lô hàng.
- Form nhập kho hiện đại, tối ưu cho tốc độ nhập liệu.

### 3. Quy Trình Đơn Hàng

- Theo dõi trạng thái đơn hàng theo dòng thời gian (Timeline).
- Hỗ trợ in hóa đơn chuyên nghiệp (Invoice).
- Quản lý khách hàng và lịch sử mua hàng tích hợp.

### 4. Quản Trị Hệ Thống

- Phân quyền người dùng: **Admin** và **Dược sĩ**.
- Nhật ký hệ thống (System Logs): Theo dõi mọi biến động và thao tác quan trọng.
- Hồ sơ cá nhân và bảo mật tài khoản.

## 🎨 Giao Diện & Trải Nghiệm (UX/UI)

- **Glassmorphism**: Sử dụng hiệu ứng kính mờ cho các thanh công cụ và tìm kiếm.
- **Premium Design**: Tone màu y tế dịu mắt, bóng đổ mềm mại (soft shadows) và animation mượt mà.
- **Modern Interactions**:
  - Thông báo dạng Toast (React-Toastify).
  - Modal xác nhận tùy chỉnh thay cho hộp thoại trình duyệt.
  - Responsive hoàn toàn trên mọi kích thước màn hình.

## 📁 Cấu Trúc Thư Mục

Dự án được tổ chức theo mô hình Component-Oriented:

- `src/components/common/`: Các UI components dùng chung (Button, Input, Modal, Table...).
- `src/components/layout/`: Header, Sidebar và Layout chính.
- `src/pages/[Module]/[PageName]/`: Chứa logic trang và CSS đi kèm (index.jsx & Custom.css).
- `src/services/api.js`: Quản lý toàn bộ API endpoints.

## 🛠️ Công Nghệ Sử Dụng

- **Core**: React 19 (Vite), React Router 7.
- **Styling**: Vanilla CSS (CSS Variables) tối ưu hiệu suất.
- **Thư viện quan trọng**:
  - `axios`: Xử lý HTTP requests.
  - `chart.js` & `react-chartjs-2`: Hiển thị biểu đồ doanh thu.
  - `react-toastify`: Thông báo Toast hiện đại.
  - `react-to-print`: Hỗ trợ in hóa đơn.
  - `date-fns`: Xử lý thời gian.

## ⚙️ Cài Đặt & Chạy Dự Án

### 1. Cài đặt các thư viện cần thiết

Mở terminal tại thư mục `frontend` và chạy lệnh sau:

```bash
npm install
```

### 2. Chạy môi trường phát triển (Development)

```bash
npm run dev
```

Sau khi chạy, truy cập vào `http://localhost:5173`.

### 3. Build sản phẩm (Production)

```bash
npm run build
```

---

_PharmaCare - Giải pháp tối ưu cho quản trị nhà thuốc hiện đại._
