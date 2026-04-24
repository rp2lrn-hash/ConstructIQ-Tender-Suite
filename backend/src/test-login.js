const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function testLogin() {
  try {
    const user = await User.findOne({ where: { email: 'admin@acme.com' } });
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.email);
    console.log('Password hash:', user.password_hash);

    const testPassword = 'Admin@123';
    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log('Password test result:', isValid);

    // Update password if invalid
    if (!isValid) {
      console.log('Updating password...');
      const newHash = await bcrypt.hash(testPassword, 10);
      await user.update({ password_hash: newHash });
      console.log('Password updated successfully');
      
      // Verify again
      const isValidAfter = await bcrypt.compare(testPassword, user.password_hash);
      console.log('Password test after update:', isValidAfter);
    }
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

testLogin();
