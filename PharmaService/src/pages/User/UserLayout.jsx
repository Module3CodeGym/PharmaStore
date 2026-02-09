import { Outlet, NavLink } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div>
      <nav style={{ padding: 10, background: '#eee' }}>
        <NavLink to="products">Sản phẩm</NavLink> |{' '}
        <NavLink to="cart">Giỏ hàng</NavLink> |{' '}
        <NavLink to="orders">Đơn hàng</NavLink> |{' '}
        <NavLink to="chat">Chat</NavLink> |{' '}
        <NavLink to="profile">Tài khoản</NavLink>
      </nav>

      <main style={{ padding: 20 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
