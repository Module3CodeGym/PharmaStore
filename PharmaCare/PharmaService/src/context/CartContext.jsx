import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Lấy dữ liệu từ localStorage khi mới vào web (để F5 không mất giỏ hàng)
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Mỗi khi cartItems thay đổi, lưu ngay vào localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Thêm sản phẩm vào giỏ
  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        // Nếu đã có -> Tăng số lượng
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Nếu chưa có -> Thêm mới với quantity = 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // 2. Xóa sản phẩm
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  // 3. Xóa sạch giỏ hàng (Sau khi thanh toán)
  const clearCart = () => {
    setCartItems([]);
  };

  // 4. Tính tổng số lượng sản phẩm (để hiện lên icon đỏ)
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // 5. Tăng giảm số lượng sản phẩm
  const updateQuantity = (productId, amount) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          // Nếu số lượng về 0 thì giữ là 1 hoặc xóa 
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};