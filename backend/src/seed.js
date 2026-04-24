const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const { User, Customer } = require('./models');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    
    // Create a default customer
    const customer = await Customer.create({
      name: 'ACME Corporation',
      industry: 'Technology',
      contact_email: 'info@acme.com',
      contact_phone: '+1-555-0100',
      address: '123 Business Ave, Suite 100',
      status: 'active'
    });
    console.log('Default customer created');

    // Create demo admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    console.log('Password hashed successfully');
    
    const user = await User.create({
      customer_id: customer.id,
      name: 'Admin User',
      email: 'admin@acme.com',
      password_hash: hashedPassword,
      role: 'admin',
      status: 'active'
    });
    console.log('Demo admin user created');

    // Verify the password
    const isValid = await bcrypt.compare('Admin@123', user.password_hash);
    console.log('Password verification:', isValid);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
