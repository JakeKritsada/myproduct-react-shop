import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API;

export default function CustomerPage() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('0');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/product_types`)
      .then(r => r.json())
      .then(d => { if (d.result) setTypes(d.data); });
    loadProducts();
  }, []);

  const loadProducts = (typeId = '0') => {
    fetch(`${API}/api/products?type_id=${typeId}`)
      .then(r => r.json())
      .then(d => { if (d.result) setProducts(d.data); });
  };

  const handleSearch = () => {
    if (!keyword.trim()) return loadProducts(selectedType);
    fetch(`${API}/api/products/search?keyword=${keyword}`)
      .then(r => r.json())
      .then(d => { if (d.result) setProducts(d.data); });
  };

  const handleTypeFilter = (typeId) => {
    setSelectedType(typeId);
    setKeyword('');
    loadProducts(typeId);
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>สินค้าทั้งหมด</h2>

      {/* Search */}
      <div style={styles.searchRow}>
        <input
          style={styles.input}
          placeholder="ค้นหาสินค้า..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button style={styles.btn} onClick={handleSearch}>ค้นหา</button>
      </div>

      {/* Filter */}
      <div style={styles.filterRow}>
        <button style={{ ...styles.filterBtn, ...(selectedType === '0' ? styles.filterBtnActive : {}) }} onClick={() => handleTypeFilter('0')}>ทั้งหมด</button>
        {types.map(t => (
          <button
            key={t.product_type_id}
            style={{ ...styles.filterBtn, ...(selectedType == t.product_type_id ? styles.filterBtnActive : {}) }}
            onClick={() => handleTypeFilter(t.product_type_id)}
          >
            {t.product_type_name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={styles.grid}>
        {products.map(p => (
          <div key={p.product_id} style={styles.card} onClick={() => setSelectedProduct(p)}>
            <div style={styles.cardImg}>🛒</div>
            <div style={styles.cardBody}>
              <div style={styles.cardName}>{p.product_name}</div>
              <div style={styles.cardType}>{p.product_type_name}</div>
              <div style={styles.cardPrice}>฿{Number(p.price).toLocaleString()}</div>
              <div style={styles.cardStock}>คงเหลือ: {p.stock} ชิ้น</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Detail */}
      {selectedProduct && (
        <div style={styles.overlay} onClick={() => setSelectedProduct(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>{selectedProduct.product_name}</h3>
            <p>ประเภท: {selectedProduct.product_type_name}</p>
            <p>ราคา: ฿{Number(selectedProduct.price).toLocaleString()}</p>
            <p>คงเหลือ: {selectedProduct.stock} ชิ้น</p>
            <p>รายละเอียด: {selectedProduct.description || '-'}</p>
            <button style={styles.btn} onClick={() => setSelectedProduct(null)}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  title: { marginBottom: '16px', fontSize: '22px' },
  searchRow: { display: 'flex', gap: '8px', marginBottom: '16px' },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '15px' },
  btn: { padding: '8px 20px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  filterRow: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  filterBtn: { padding: '6px 16px', border: '1px solid #ccc', borderRadius: '20px', background: 'white', cursor: 'pointer' },
  filterBtnActive: { background: '#1a1a2e', color: 'white', borderColor: '#1a1a2e' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' },
  card: { border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' },
  cardImg: { background: '#f5f5f5', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' },
  cardBody: { padding: '12px' },
  cardName: { fontWeight: 'bold', marginBottom: '4px' },
  cardType: { fontSize: '12px', color: '#888', marginBottom: '8px' },
  cardPrice: { color: '#e94560', fontWeight: 'bold', fontSize: '18px' },
  cardStock: { fontSize: '12px', color: '#555', marginTop: '4px' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 },
  modal: { background: 'white', padding: '32px', borderRadius: '12px', minWidth: '320px', maxWidth: '480px' },
};