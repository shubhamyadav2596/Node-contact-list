const express = require('express');
const multer = require('multer');
const router = express.Router();
const contactController = require('../controllers/contactController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.any(), (req, res) => {
  

    if (req.files && req.files.length > 0) {
        req.file = req.files[0]; 
    }

    contactController.uploadContacts(req, res);
});

router.get('/', contactController.getContacts);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

module.exports = router;