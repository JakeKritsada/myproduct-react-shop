import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API;

const emptyForm = { product_name: '', product_type_id: '', price: '', stock: '', description: '' };

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${API}/api/product_types`)
      .then(r => r.json())
      .then(d => { if (d.result) setTypes(d.data); });
    loadProducts();
  }, []);

  const loadProducts = () => {
    fetch(`${API}/api/products`)
      .then(r => r.json())
      .then(d => { if (d.result) setProducts(d.data); });
  };

  const handleSubmit = () => {
    if (!form.product_name || !form.product_type_id || !form.price) {
      setMessage('กรุณากรอกข้อมูลให้ครบ');
      return;
    }

    const url = editId ? `${API}/api/product/edit/${editId}` : `${API}/api/product/add`;
    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(r => r.json())
      .then(d => {
        setMessage(d.message);
        setForm(emptyForm);
        setEditId(null);
        loadProducts();
      });
  };

  const handleEdit = (p) => {
    setEditId(p.product_id);
    setForm({
      product_name: p.product_name,
      product_type_id: p.product_type_id,
      price: p.price,
      stock: p.stock,
      description: p.description || ''
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    if (!window.confirm('ยืนยันการลบสินค้านี้?')) return;
    fetch(`${API}/api/product/delete/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(d => {
        setMessage(d.message);
        loadProducts();
      });
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>จัดการสินค้า</h2>

      {/* Form */}
      <div style={styles.formBox}>
        <h3 style={{ marginBottom: '16px' }}>{editId ? '✏️ แก้ไขสินค้า' : '➕ เพิ่มสินค้าใหม่'}</h3>
        {message && <div style={styles.msg}>{message}</div>}

        <div style={styles.formGrid}>
          <div>
            <label style={styles.label}>ชื่อสินค้า</label>
            <input style={styles.input} value={form.product_name} onChange={e => setForm({ ...form, product_name: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>ประเภท</label>
            <select style={styles.input} value={form.product_type_id} onChange={e => setForm({ ...form, product_type_id: e.target.value })}>
              <option value="">-- เลือกประเภท --</option>
              {types.map(t => <option key={t.product_type_id} value={t.product_type_id}>{t.product_type_name}</option>)}
            </select>
          </div>
          <div>
            <label style={styles.label}>ราคา (฿)</label>
            <input style={styles.input} type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div>
            <label style={styles.label}>สต็อก</label>
            <input style={styles.input} type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <label style={styles.label}>รายละเอียด</label>
          <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button style={styles.btnPrimary} onClick={handleSubmit}>{editId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}</button>
          {editId && <button style={styles.btnSecondary} onClick={() => { setForm(emptyForm); setEditId(null); setMessage(''); }}>ยกเลิก</button>}
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableBox}>
        <h3 style={{ marginBottom: '12px' }}>รายการสินค้าทั้งหมด ({products.length} รายการ)</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>ชื่อสินค้า</th>
              <th style={styles.th}>ประเภท</th>
              <th style={styles.th}>ราคา</th>
              <th style={styles.th}>สต็อก</th>
              <th style={styles.th}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={p.product_id} style={i % 2 === 0 ? {} : { background: '#f9f9f9' }}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{p.product_name}</td>
                <td style={styles.td}>{p.product_type_name}</td>
                <td style={styles.td}>฿{Number(p.price).toLocaleString()}</td>
                <td style={styles.td}>{p.stock}</td>
                <td style={styles.td}>
                  <button style={styles.btnEdit} onClick={() => handleEdit(p)}>แก้ไข</button>
                  <button style={styles.btnDelete} onClick={() => handleDelete(p.product_id)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px', maxWidth: '1100px', margin: '0 auto' },
  title: { marginBottom: '20px', fontSize: '22px' },
  formBox: { background: '#f8f8f8', padding: '24px', borderRadius: '10px', marginBottom: '32px', border: '1px solid #eee' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label: { display: 'block', marginBottom: '4px', fontSize: '13px', color: '#555' },
  input: { width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  msg: { background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '6px', marginBottom: '12px' },
  btnPrimary: { padding: '9px 24px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  btnSecondary: { padding: '9px 24px', background: '#888', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
  tableBox: { background: 'white', border: '1px solid #eee', borderRadius: '10px', padding: '20px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1a1a2e', color: 'white' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '14px' },
  td: { padding: '10px 14px', borderBottom: '1px solid #eee', fontSize: '14px' },
  btnEdit: { padding: '4px 12px', background: '#2196f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' },
  btnDelete: { padding: '4px 12px', background: '#e53935', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
};