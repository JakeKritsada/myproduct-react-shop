require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {}
});

// TEST CONNECTION
pool.getConnection((err, conn) => {
    if (err) {
        console.error('Database Error:', err);
    } else {
        console.log('TiDB Connected!');
        conn.release();
    }
});

// HOME
app.get('/', (req, res) => {
    res.send('API Running');
});

// PRODUCT TYPES
app.get('/api/product_types', (req, res) => {

    console.log('CALL API product_types');

    pool.query(
        'SELECT * FROM product_types',
        (err, results) => {

            if (err) {

                console.log('SQL ERROR:', err);

                return res.json({
                    result: false,
                    message: err.message
                });
            }

            console.log(results);

            res.json({
                result: true,
                data: results
            });
        }
    );
});

// PRODUCTS
app.get('/api/products', (req, res) => {

    const typeId = req.query.type_id;

    let sql = `
        SELECT 
            p.*,
            t.product_type_name
        FROM products p
        LEFT JOIN product_types t
        ON p.product_type_id = t.product_type_id
    `;

    let params = [];

    if (typeId && typeId !== '0') {
        sql += ' WHERE p.product_type_id = ?';
        params.push(typeId);
    }

    pool.query(sql, params, (err, results) => {

        if (err) {
            return res.json({
                result: false,
                message: err.message
            });
        }

        res.json({
            result: true,
            data: results
        });
    });
});

// SEARCH
app.get('/api/products/search', (req, res) => {

    const keyword = req.query.keyword || '';

    const sql = `
        SELECT 
            p.*,
            t.product_type_name
        FROM products p
        LEFT JOIN product_types t
        ON p.product_type_id = t.product_type_id
        WHERE p.product_name LIKE ?
    `;

    pool.query(
        sql,
        [`%${keyword}%`],
        (err, results) => {

            if (err) {
                return res.json({
                    result: false,
                    message: err.message
                });
            }

            res.json({
                result: true,
                data: results
            });
        }
    );
});

// ADD PRODUCT
app.post('/api/product/add', (req, res) => {

    const {
        product_name,
        product_type_id,
        price,
        stock,
        description
    } = req.body;

    const sql = `
        INSERT INTO products
        (
            product_name,
            product_type_id,
            price,
            stock,
            description
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    pool.query(
        sql,
        [
            product_name,
            product_type_id,
            price,
            stock,
            description
        ],
        (err) => {

            if (err) {
                return res.json({
                    result: false,
                    message: err.message
                });
            }

            res.json({
                result: true,
                message: 'เพิ่มสินค้าสำเร็จ'
            });
        }
    );
});

// EDIT PRODUCT
app.put('/api/product/edit/:id', (req, res) => {

    const {
        product_name,
        product_type_id,
        price,
        stock,
        description
    } = req.body;

    const sql = `
        UPDATE products
        SET
            product_name = ?,
            product_type_id = ?,
            price = ?,
            stock = ?,
            description = ?
        WHERE product_id = ?
    `;

    pool.query(
        sql,
        [
            product_name,
            product_type_id,
            price,
            stock,
            description,
            req.params.id
        ],
        (err) => {

            if (err) {
                return res.json({
                    result: false,
                    message: err.message
                });
            }

            res.json({
                result: true,
                message: 'แก้ไขสินค้าสำเร็จ'
            });
        }
    );
});

// DELETE PRODUCT
app.delete('/api/product/delete/:id', (req, res) => {

    pool.query(
        'DELETE FROM products WHERE product_id = ?',
        [req.params.id],
        (err) => {

            if (err) {
                return res.json({
                    result: false,
                    message: err.message
                });
            }

            res.json({
                result: true,
                message: 'ลบสินค้าสำเร็จ'
            });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});