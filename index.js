const express = require('express');
const sequelize = require('./config/database');
const contactRoutes = require('./routes/contactRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/contacts', contactRoutes);

// Database Sync and Server Initialization
sequelize.sync({ alter: true }) // 'alter' updates the schema if models change safely
  .then(() => {
    console.log('Database connected and models synchronized.');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });