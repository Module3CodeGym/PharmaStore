import { getCart, saveCart, getOrders, saveOrders } from '../../../utils/store';
import { formatPrice } from '../../../utils/format';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const cart = getCart();
  const navigate = useNavigate();

  const checkout = () => {
    const orders = getOrders();
    orders.push({
      id: Date.now(),
      items: cart,
      status: 'Chờ xử lý',
      createdAt: new Date().toLocaleString(),
    });

    saveOrders(orders);
    saveCart([]);
    navigate('/user/orders');
  };

  if (cart.length === 0)
    return <p className="empty">Giỏ hàng trống</p>;

  return (
    <div className="card">
      <h2>Giỏ hàng</h2>

      {cart.map((c, i) => (
        <div key={i} className="cart-item">
          <span>{c.name}</span>
          <b>{formatPrice(c.price)}</b>
        </div>
      ))}

      <button className="btn-primary" onClick={checkout}>
        Thanh toán
      </button>
    </div>
  );
};

export default Cart;
