// const express = require('express');
// const router = express.Router();
// const db = require('../db');

// // create an admin
// router.post('/', (req, res) => {
//     const { name, phone_no, email, password, status} = req.body;
//     const query = 'INSERT INTO admins (name, phone_no, email, password, status) VALUES (?, ?, ?, ?, ?)';
//     db.query(query, [name, phone_no, email, password, status], (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.status(201).json({ id: results.insertId });
//     });
// });

// //get all admin
// router.get('/', (req, res) => {
//     db.query('SELECT * FROM admins', (err, results) => {
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(results);
//     });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Make sure this is your createPool instance
const bcrypt = require("bcrypt");


// Create an admin
// router.post('/', async (req, res) => {
//     const { name, phone_no, email, password, status } = req.body;

//     try {
//         const query = 'INSERT INTO admin (name, phone_no, email, password, status) VALUES (?, ?, ?, ?, ?)';
//         const [results] = await pool.query(query, [name, phone_no, email, password, status]);
        
//         res.status(201).json({ id: results.insertId });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });
router.post('/', async (req, res) => {
    const { name, phone_no, email, status } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(phone_no, 10); // default password = phone number

        const query = 'INSERT INTO admin (name, phone_no, email, password, status) VALUES (?, ?, ?, ?, ?)';
        const [results] = await pool.query(query, [name, phone_no, email, hashedPassword, status]);
        
        res.status(201).json({ id: results.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all admins
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM admins');
        
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
