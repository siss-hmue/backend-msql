const express = require('express');
const router = express.Router();
const pool = require('../db'); // Ensure this is your createPool instance

// Create a lab_data
router.post('/', async (req, res) => {
    const {
        hn_number,
        gender,
        blood_type,
        age,
        date_of_birth,
        weight,
        height,
        bmi,
        systolic,
        diastolic,
        order_date
    } = req.body;

    // Validate HN number format
    if (!/^\d{9}$/.test(hn_number)) {
        return res.status(400).json({ error: "HN Number must be exactly 9 digits" });
    }

    try {
        // First check if the hn_number exists in patients table
        const [results] = await pool.query('SELECT hn_number FROM patients WHERE hn_number = ?', [hn_number]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Patient with this HN number does not exist' });
        }

        // If hn_number exists, proceed with lab data insertion
        const insertQuery = 'INSERT INTO lab_data (hn_number, gender, blood_type, age, date_of_birth, weight, height, bmi, systolic, diastolic, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        const [insertResults] = await pool.query(insertQuery, [
            hn_number,
            gender,
            blood_type,
            age,
            date_of_birth,
            weight,
            height,
            bmi,
            systolic,
            diastolic,
            order_date
        ]);

        // After successful lab data insertion, update patient's lab_data_status
        const updateQuery = 'UPDATE patients SET lab_data_status = true WHERE hn_number = ?';

        await pool.query(updateQuery, [hn_number]);

        res.status(201).json({
            id: insertResults.insertId,
            message: "Lab data created and patient status updated successfully"
        });
    } catch (error) {
        console.error("Error processing lab data:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get all lab_data
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM lab_data');
        res.json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
