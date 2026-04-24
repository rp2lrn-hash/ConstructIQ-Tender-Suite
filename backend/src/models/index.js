const { sequelize } = require('../config/database');
const Customer = require('./Customer');
const User = require('./User');
const Tender = require('./Tender');
const Vendor = require('./Vendor');
const Bid = require('./Bid');
const Evaluation = require('./Evaluation');
const Contract = require('./Contract');
const AuditLog = require('./AuditLog');
const Questionnaire = require('./Questionnaire');
const Question = require('./Question');
const Response = require('./Response');
const AnswerDetail = require('./AnswerDetail');
const Assignment = require('./Assignment');
const Notification = require('./Notification');

// Define relationships
Customer.hasMany(User, { foreignKey: 'customer_id', as: 'users' });
User.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(Tender, { foreignKey: 'customer_id', as: 'tenders' });
Tender.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(Vendor, { foreignKey: 'customer_id', as: 'vendors' });
Vendor.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Tender.hasMany(Bid, { foreignKey: 'tender_id', as: 'bids' });
Bid.belongsTo(Tender, { foreignKey: 'tender_id', as: 'tender' });

Vendor.hasMany(Bid, { foreignKey: 'vendor_id', as: 'bids' });
Bid.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

Customer.hasMany(Bid, { foreignKey: 'customer_id', as: 'bids' });
Bid.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Bid.hasOne(Evaluation, { foreignKey: 'bid_id', as: 'evaluation' });
Evaluation.belongsTo(Bid, { foreignKey: 'bid_id', as: 'bid' });

Tender.hasOne(Contract, { foreignKey: 'tender_id', as: 'contract' });
Contract.belongsTo(Tender, { foreignKey: 'tender_id', as: 'tender' });

Vendor.hasMany(Contract, { foreignKey: 'vendor_id', as: 'contracts' });
Contract.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });

Customer.hasMany(Contract, { foreignKey: 'customer_id', as: 'contracts' });
Contract.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(AuditLog, { foreignKey: 'customer_id', as: 'audit_logs' });
AuditLog.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Questionnaire relationships
Customer.hasMany(Questionnaire, { foreignKey: 'customer_id', as: 'questionnaires' });
Questionnaire.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Tender.hasMany(Questionnaire, { foreignKey: 'project_id', as: 'questionnaires' });
Questionnaire.belongsTo(Tender, { foreignKey: 'project_id', as: 'project' });

User.hasMany(Questionnaire, { foreignKey: 'created_by', as: 'created_questionnaires' });
Questionnaire.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Questionnaire.hasMany(Question, { foreignKey: 'questionnaire_id', as: 'questions' });
Question.belongsTo(Questionnaire, { foreignKey: 'questionnaire_id', as: 'questionnaire' });

Questionnaire.hasMany(Response, { foreignKey: 'questionnaire_id', as: 'responses' });
Response.belongsTo(Questionnaire, { foreignKey: 'questionnaire_id', as: 'questionnaire' });

Tender.hasMany(Response, { foreignKey: 'project_id', as: 'responses' });
Response.belongsTo(Tender, { foreignKey: 'project_id', as: 'project' });

Customer.hasMany(Response, { foreignKey: 'customer_id', as: 'responses' });
Response.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

User.hasMany(Response, { foreignKey: 'submitted_by', as: 'submitted_responses' });
Response.belongsTo(User, { foreignKey: 'submitted_by', as: 'submitter' });

Response.hasMany(AnswerDetail, { foreignKey: 'response_id', as: 'answer_details' });
AnswerDetail.belongsTo(Response, { foreignKey: 'response_id', as: 'response' });

Question.hasMany(AnswerDetail, { foreignKey: 'question_id', as: 'answer_details' });
AnswerDetail.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });

// Assignment relationships
Questionnaire.hasMany(Assignment, { foreignKey: 'questionnaire_id', as: 'assignments' });
Assignment.belongsTo(Questionnaire, { foreignKey: 'questionnaire_id', as: 'questionnaire' });

User.hasMany(Assignment, { foreignKey: 'assigned_to', as: 'received_assignments' });
Assignment.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

User.hasMany(Assignment, { foreignKey: 'assigned_by', as: 'created_assignments' });
Assignment.belongsTo(User, { foreignKey: 'assigned_by', as: 'assigner' });

Assignment.hasOne(Response, { foreignKey: 'assignment_id', as: 'response' });
Response.belongsTo(Assignment, { foreignKey: 'assignment_id', as: 'assignment' });

// Notification relationships
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  Customer,
  User,
  Tender,
  Vendor,
  Bid,
  Evaluation,
  Contract,
  AuditLog,
  Questionnaire,
  Question,
  Response,
  AnswerDetail,
  Assignment,
  Notification
};
