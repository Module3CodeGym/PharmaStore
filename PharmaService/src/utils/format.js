export const formatPrice = price =>
  price.toLocaleString('vi-VN') + 'đ';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const stockLabel = stock => {
  if (stock === 0) return { text: 'Hết hàng', color: 'red' };
  if (stock < 100) return { text: `Còn ${stock}`, color: 'orange' };
  return { text: `Còn ${stock}`, color: 'green' };
};