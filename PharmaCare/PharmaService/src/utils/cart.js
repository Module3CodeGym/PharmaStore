export const getCart = () =>
  JSON.parse(localStorage.getItem('cart')) || [];

export const addToCart = product => {
  const cart = getCart();
  cart.push({ ...product, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
};
