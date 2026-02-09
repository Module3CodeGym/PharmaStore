export const formatPrice = price =>
  price.toLocaleString('vi-VN') + 'đ';

export const stockLabel = stock => {
  if (stock === 0) return { text: 'Hết hàng', color: 'red' };
  if (stock < 100) return { text: `Còn ${stock}`, color: 'orange' };
  return { text: `Còn ${stock}`, color: 'green' };
};
