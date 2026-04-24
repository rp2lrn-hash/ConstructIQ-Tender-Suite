const { sequelize } = require('./config/database');
const { Questionnaire, Question, Response, AnswerDetail } = require('./models');

async function syncDatabase() {
  try {
    console.log('Syncing database...');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    
    console.log('Database synced successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
}

syncDatabase();
