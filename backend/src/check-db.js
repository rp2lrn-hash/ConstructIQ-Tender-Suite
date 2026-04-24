const { sequelize } = require('./config/database');
const { User, Customer } = require('./models');

const checkDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    const users = await User.findAll();
    console.log('Total users:', users.length);
    users.forEach(user => {
      console.log('User:', user.email, 'Role:', user.role, 'Has password:', !!user.password_hash);
    });

    const customers = await Customer.findAll();
    console.log('Total customers:', customers.length);
    customers.forEach(customer => {
      console.log('Customer:', customer.name, 'Email:', customer.contact_email);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkDatabase();
