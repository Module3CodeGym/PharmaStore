import { useParams } from 'react-router-dom';
import { products } from '../../../utils/db';
import { addToCart } from '../../../utils/cart';
import { formatPrice } from '../../../utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));

  if (!product) return <p>Không tìm thấy thuốc</p>;

  return (
    <div className="card">
      <h2>{product.name}</h2>
      <p><b>Hoạt chất:</b> {product.active}</p>
      <p><b>Đơn vị:</b> {product.unit}</p>
      <p><b>Giá:</b> {formatPrice(product.price)}</p>

      <button onClick={() => addToCart(product)}>
        Thêm vào giỏ
      </button>
    </div>
  );
};

export default ProductDetail;
