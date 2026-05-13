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

    ssl: {
        minVersion: 'TLSv1.2'
    }
});
pool.getConnection((err, conn) => {
    if (err) {
        console.error('Database Error:', err);
    } else {
        console.log('TiDB Connected!');
        conn.release();
    }
});

// TEST API
app.get('/', (req, res) => {
    res.send('API Running');
});

app.get('/api/products', (req, res) => {
    pool.query('SELECT * FROM products', (err, results) => {
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});