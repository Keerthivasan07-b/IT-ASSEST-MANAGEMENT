const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const assetRoutes = require('./routes/assetRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'IT Asset Management API is running normally.' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
