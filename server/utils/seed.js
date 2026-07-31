require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Asset = require('../models/Asset');
const AssetHistory = require('../models/AssetHistory');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/it-asset-management';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Employee.deleteMany({});
    await Asset.deleteMany({});
    await AssetHistory.deleteMany({});
    console.log('Cleared existing data.');

    // 1. Create Admin User
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@company.com',
      password: 'password123',
      role: 'Admin'
    });
    console.log('Created Admin:', admin.email);

    // 2. Create Employees
    const emp1 = await Employee.create({
      employeeId: 'EMP-101',
      name: 'Sarah Connor',
      department: 'Engineering',
      designation: 'Senior Frontend Engineer',
      email: 'sarah.c@company.com',
      phone: '+1 555-0101'
    });

    const emp2 = await Employee.create({
      employeeId: 'EMP-102',
      name: 'Michael Scott',
      department: 'Management',
      designation: 'Regional Manager',
      email: 'michael.s@company.com',
      phone: '+1 555-0102'
    });

    const emp3 = await Employee.create({
      employeeId: 'EMP-103',
      name: 'Pam Beesly',
      department: 'Human Resources',
      designation: 'HR Specialist',
      email: 'pam.b@company.com',
      phone: '+1 555-0103'
    });
    console.log('Created 3 Employees.');

    // 3. Create Assets
    const asset1 = await Asset.create({
      assetId: 'AST-1001',
      assetName: 'MacBook Pro 16"',
      category: 'Laptop',
      brand: 'Apple',
      model: 'M3 Max 36GB',
      serialNumber: 'C02FX912MD6M',
      purchaseDate: new Date('2024-01-15'),
      warrantyExpiry: new Date('2027-01-15'),
      price: 3499,
      status: 'Assigned',
      assignedTo: emp1._id
    });

    const asset2 = await Asset.create({
      assetId: 'AST-1002',
      assetName: 'Dell UltraSharp 27" 4K',
      category: 'Monitor',
      brand: 'Dell',
      model: 'U2723QE',
      serialNumber: 'CN-0K982X',
      purchaseDate: new Date('2023-06-10'),
      warrantyExpiry: new Date('2026-06-10'),
      price: 580,
      status: 'Assigned',
      assignedTo: emp1._id
    });

    const asset3 = await Asset.create({
      assetId: 'AST-1003',
      assetName: 'ThinkPad X1 Carbon',
      category: 'Laptop',
      brand: 'Lenovo',
      model: 'Gen 11',
      serialNumber: 'PF-49821X',
      purchaseDate: new Date('2023-09-01'),
      warrantyExpiry: new Date('2026-09-01'),
      price: 1850,
      status: 'Available'
    });

    const asset4 = await Asset.create({
      assetId: 'AST-1004',
      assetName: 'Logitech MX Master 3S',
      category: 'Mouse',
      brand: 'Logitech',
      model: 'MX Master 3S',
      serialNumber: 'LZ-99120',
      purchaseDate: new Date('2024-02-20'),
      price: 99,
      status: 'Available'
    });

    const asset5 = await Asset.create({
      assetId: 'AST-1005',
      assetName: 'Adobe Creative Cloud License',
      category: 'Software License',
      brand: 'Adobe',
      model: 'Enterprise Suite',
      serialNumber: 'ADOBE-CC-9921',
      purchaseDate: new Date('2024-01-01'),
      warrantyExpiry: new Date('2025-01-01'),
      price: 600,
      status: 'Assigned',
      assignedTo: emp3._id
    });
    console.log('Created 5 Assets.');

    // 4. Create Asset History
    await AssetHistory.create({
      asset: asset1._id,
      employee: emp1._id,
      assignedDate: new Date('2024-01-16')
    });

    await AssetHistory.create({
      asset: asset2._id,
      employee: emp1._id,
      assignedDate: new Date('2024-01-16')
    });

    await AssetHistory.create({
      asset: asset5._id,
      employee: emp3._id,
      assignedDate: new Date('2024-02-01')
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
