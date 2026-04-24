const bcrypt = require('bcryptjs');
const { User, Customer } = require('./models');

const createUsers = async () => {
  try {
    console.log('Connecting to database...');
    
    // Get the default customer
    const customer = await Customer.findOne({ where: { name: 'ACME Corporation' } });
    if (!customer) {
      console.error('Default customer not found. Please run seed.js first.');
      process.exit(1);
    }

    const password = 'User@123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = [
      { name: 'Prabha', email: 'prabha@acme.com', role: 'evaluator' },
      { name: 'Naveen', email: 'naveen@acme.com', role: 'evaluator' },
      { name: 'Saravana', email: 'saravana@acme.com', role: 'evaluator' }
    ];

    for (const userData of users) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (existingUser) {
        console.log(`User ${userData.name} (${userData.email}) already exists. Skipping.`);
        continue;
      }

      await User.create({
        name: userData.name,
        email: userData.email,
        password_hash: hashedPassword,
        role: userData.role,
        customer_id: customer.id
      });

      console.log(`Created user: ${userData.name} (${userData.email})`);
    }

    console.log('\nAll users created successfully!');
    console.log('Password for all users: User@123');
    console.log('\nUser credentials:');
    console.log('1. Prabha: prabha@acme.com / User@123');
    console.log('2. Naveen: naveen@acme.com / User@123');
    console.log('3. Saravana: saravana@acme.com / User@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating users:', error);
    process.exit(1);
  }
};

createUsers();
