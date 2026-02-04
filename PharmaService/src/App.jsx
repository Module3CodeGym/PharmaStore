import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'; 

function App() {
  return (
    <> 
     
      <Header />
      
      <main>
         {/* Nội dung trang chủ/chi tiết sẽ nằm ở đây */}
         <h1>Chào mừng đến với Nhà thuốc Online</h1>
         <p>Nội dung đang được cập nhật...</p>
      </main>

      <Footer />
    </>
  )
}

export default App;