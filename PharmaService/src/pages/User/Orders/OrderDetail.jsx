import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Chi tiết đơn hàng</h2>
      <p>Mã đơn: {id}</p>
    </div>
  );
};

export default OrderDetail;
