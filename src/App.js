import { useState } from 'react';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App() {
  const [page, setPage] = useState('customer');

  return (
    <div>
      <nav style={styles.nav}>
        <span style={styles.brand}>🛍️ MyProduct</span>
        <div>
          <button
            style={{ ...styles.navBtn, ...(page === 'customer' ? styles.navBtnActive : {}) }}
            onClick={() => setPage('customer')}
          >
            หน้าสินค้า
          </button>
          <button
            style={{ ...styles.navBtn, ...(page === 'admin' ? styles.navBtnActive : {}) }}
            onClick={() => setPage('admin')}
          >
            จัดการสินค้า (Admin)
          </button>
        </div>
      </nav>

      {page === 'customer' ? <CustomerPage /> : <AdminPage />}
    </div>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    background: '#1a1a2e',
    color: 'white',
  },
  brand: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navBtn: {
    marginLeft: '12px',
    padding: '8px 18px',
    border: '1px solid #555',
    borderRadius: '6px',
    background: 'transparent',
    color: 'white',
    cursor: 'pointer',
  },
  navBtnActive: {
    background: '#e94560',
    borderColor: '#e94560',
  },
};

export default App;