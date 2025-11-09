const express = require('express');
const upload = require('../middlewear/upload_image');
const db = require('../db');
const path = require('path');
const router = express.Router();
const fs = require('fs');


router.get('/:id', async (req, res) => {
    const doctorId = req.params.id;
  
    try {
      const [rows] = await db.execute('SELECT * FROM doctors WHERE id = ?', [doctorId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
  
      const doctor = rows[0];
  
      // Add full image URL
      if (doctor.image) {
        doctor.imageUrl = `http://localhost:3000/${doctor.image}`;
      }
  
      res.json(doctor);
    } catch (err) {
      console.error('Error fetching doctor:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// PATCH /doctors/:id/image — update profile image
router.patch('/upload/:id', upload.single('image'), async (req, res) => {
    const doctorId = req.params.id;
  
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }
  
    const imagePath = req.file.path;
  
    try {
      const [result] = await db.execute(
        'UPDATE doctors SET image = ?, updated_at = NOW() WHERE id = ?',
        [imagePath, doctorId]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
  
      res.json({
        message: 'Doctor profile image updated',
        imagePath: imagePath,
        imageUrl: `http://localhost:3000/${imagePath}`
      });
    } catch (err) {
      console.error('Error updating doctor image:', err);
      res.status(500).json({ error: 'Failed to update image' });
    }
  });

  router.delete('/delete/:id', async (req, res) => {
    const doctorId = req.params.id;
  
    try {
      // Get current image path from DB
      const [rows] = await db.execute('SELECT image FROM doctors WHERE id = ?', [doctorId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
  
      const imagePath = rows[0].image;
  
      // Delete file from disk if it exists
      if (imagePath) {
        const fullPath = path.join(__dirname, '..', imagePath);
        fs.unlink(fullPath, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.warn('Image file deletion failed:', err);
          }
        });
      }
  
      // Update DB: remove image reference
      await db.execute(
        'UPDATE doctors SET image = NULL, updated_at = NOW() WHERE id = ?',
        [doctorId]
      );
  
      res.json({ message: 'Doctor profile image removed' });
    } catch (err) {
      console.error('Error removing doctor image:', err);
      res.status(500).json({ error: 'Failed to remove image' });
    }
  });
  
  module.exports = router;

