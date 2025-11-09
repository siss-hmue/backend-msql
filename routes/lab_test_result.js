// const express = require('express');
// const router = express.Router();
// const db = require('../db');

// //create a lab_test_result
// router.post('/', (req, res)=>{
//     const {lab_test_name, lab_test_result, lab_data_id} = req.body;
//     const query = 'INSERT INTO lab_test_result (lab_test_name, lab_test_result, lab_data_id) VALUES (?,?,?)';
//     db.query(query, [lab_test_name, lab_test_result, lab_data_id], (err,results)=>{
//         if(err){
//             return res.status(500).json({ error: err.message });
//         }
//         res.status(201).json({ id: results.insertId });
//     });
// });

// // get all lab_test_result
// router.get('/', (req, res)=>{
//     db.query('SELECT * FROM lab_test_result', (err,results)=>{
//         if (err) {
//             return res.status(500).json({ error: err.message });
//         }
//         res.json(results);
//     });
// });
// module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db'); // Ensure this is your createPool instance

// Create a lab_test_result
router.post('/', async (req, res) => {
    const { lab_test_name, lab_test_result, lab_data_id } = req.body;
    const query = 'INSERT INTO lab_test_result (lab_test_name, lab_test_result, lab_data_id) VALUES (?, ?, ?)';

    try {
        const [results] = await pool.query(query, [lab_test_name, lab_test_result, lab_data_id]);
        res.status(201).json({ id: results.insertId });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Get all lab_test_result
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM lab_test_result');
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
