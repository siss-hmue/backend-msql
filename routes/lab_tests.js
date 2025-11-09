// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// // ****
// // Get all test name from lab_tests_master
// router.get("/", (req, res) => {
//     db.query("SELECT * FROM lab_tests_master", (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.json(results);
//     });
//   });


// module.exports = router;
const express = require("express");
const router = express.Router();
const pool = require("../db"); // Ensure this is your createPool instance

// Get all test names from lab_tests_master
router.get("/", async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM lab_tests_master");
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
