import { getOrders } from '../../../utils/store';

const MyOrders = () => {
  const orders = getOrders();

  if (orders.length === 0)
    return <p className="empty">Chưa có đơn hàng</p>;

  return (
    <div className="card">
      <h2>Đơn hàng của tôi</h2>

      {orders.map(o => (
        <div key={o.id} className="order-card">
          <div>
            <b>Mã đơn:</b> {o.id}
          </div>
          <div>
            <b>Thời gian:</b> {o.createdAt}
          </div>
          <div className="badge orange">{o.status}</div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
