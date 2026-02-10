import { products } from '../../../utils/db';
import { getCart, saveCart } from '../../../utils/store';
import { formatPrice } from '../../../utils/format';

const ProductList = () => {
  const addToCart = product => {
    const cart = getCart();
    cart.push({ ...product, qty: 1 });
    saveCart(cart);
    alert('Đã thêm vào giỏ hàng');
  };

  return (
    <div className="card">
      <h2>Tra cứu thuốc</h2>

      <table className="table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Hoạt chất</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>
                <b>{p.name}</b>
                <div className="tag">{p.category}</div>
              </td>
              <td>{p.active}</td>
              <td className="price">{formatPrice(p.price)}</td>
              <td>
                <span className={`badge ${p.stock === 0 ? 'red' : p.stock < 100 ? 'orange' : 'green'}`}>
                  {p.stock === 0 ? 'Hết hàng' : `Còn ${p.stock}`}
                </span>
              </td>
              <td>
                {p.stock > 0 && (
                  <button onClick={() => addToCart(p)}>
                    Thêm
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
