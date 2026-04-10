const express = require('express');
const multer = require('multer');
const router = express.Router();
const contactController = require('../controllers/contactController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.any(), (req, res) => {
    console.log("==== UPLOAD DEBUG INFO ====");
    console.log("1. Files jo server tak aayi:", req.files);
    console.log("2. Text fields jo server tak aaye (Agar body mein kuch extra hai):", req.body);
    console.log("===========================");

    if (req.files && req.files.length > 0) {
        req.file = req.files[0]; 
    }

    contactController.uploadContacts(req, res);
});

router.get('/', contactController.getContacts);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;