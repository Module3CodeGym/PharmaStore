import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Dùng 'instant' để loại bỏ hoàn toàn hiệu ứng cuộn mượt (nếu có), giúp trang xuất hiện ngay trên cùng
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" 
    });
  }, [pathname]);

  return null;
}