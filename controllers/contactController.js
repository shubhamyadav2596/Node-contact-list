const xlsx = require('xlsx');
const { Op } = require('sequelize');
const Contact = require('../models/Contact');

// POST /api/contacts/upload
exports.uploadContacts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an Excel file.' });
    }

    // Read the file from memory buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const validRows = sheetData.filter(row => row.Name && row.Email && row.Phone);

    if (validRows.length === 0) {
      return res.status(400).json({ 
        error: 'No valid data found. Make sure columns are named exactly: Name, Email, Phone and are not empty.' 
      });
    }

    // Format data 
    const contactsData = validRows.map(row => ({
      name: String(row.Name).trim(),
      email: String(row.Email).trim(),
      phone: String(row.Phone).trim() // Safe conversion
    }));

    // Insert into database
    await Contact.bulkCreate(contactsData, { 
      ignoreDuplicates: true,
      validate: true
    });

    res.status(201).json({ message: 'Contacts uploaded and synced successfully.' });
  } catch (error) {
    console.error('Upload Error:', error); // find error details in console
    res.status(500).json({ error: 'Error processing the file', details: error.message });
  }
};

// GET /api/contacts
exports.getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', filterColumn, filterValue } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};

    // Global Search
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    // Specific Column Filtering
    if (filterColumn && filterValue) {
      whereClause[filterColumn] = { [Op.like]: `%${filterValue}%` };
    }

    const contacts = await Contact.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      totalItems: contacts.count,
      totalPages: Math.ceil(contacts.count / limit),
      currentPage: parseInt(page),
      data: contacts.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve contacts', details: error.message });
  }
};

// PUT /api/contacts/:id
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await contact.update({ name, email, phone });
    res.status(200).json({ message: 'Contact updated successfully', data: contact });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email or Phone already exists in the database.' });
    }
    res.status(500).json({ error: 'Failed to update contact', details: error.message });
  }
};

// DELETE /api/contacts/:id
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedCount = await Contact.destroy({
      where: { id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact', details: error.message });
  }
};