import React, { createContext, useContext, useState } from 'react';

// Tạo Context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 1. Hàm Thêm vào giỏ (Đã fix lỗi NaN và giữ giá đơn thuốc)
  const addToCart = (product) => {
    setCartItems((prevCart) => {
      const incomingPrice = Number(product.price) || 0;
      const incomingQty = Number(product.quantity) || 1;

      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + incomingQty,
                price: incomingPrice > 0 ? incomingPrice : item.price 
              }
            : item
        );
      }
      return [...prevCart, { ...product, price: incomingPrice, quantity: incomingQty }];
    });
  };

  // 2. Hàm Cập nhật số lượng (Dùng cho nút + - trong Cart.jsx)
  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (Number(item.quantity) || 0) + amount) }
          : item
      )
    );
  };

  // 3. Hàm Xóa sản phẩm
  const removeFromCart = (id) => setCartItems((prev) => prev.filter(i => i.id !== id));

  // 4. Hàm Xóa sạch giỏ hàng (Dùng sau khi thanh toán thành công)
  const clearCart = () => setCartItems([]);

  // 5. Tính tổng số lượng sản phẩm hiển thị trên Header badge
  const totalItems = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// --- QUAN TRỌNG: Thêm export này để sửa lỗi ở Header.jsx ---
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};