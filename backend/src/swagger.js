const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tender Management System API',
      version: '1.0.0',
      description: 'API documentation for Tender Management System with multi-tenant support',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { 
              type: 'string', 
              enum: ['admin', 'evaluator', 'vendor', 'customer_user'] 
            },
            customer_id: { type: 'string' }
          }
        },
        Tender: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { 
              type: 'string', 
              enum: ['draft', 'published', 'closed', 'awarded', 'cancelled'] 
            },
            deadline: { type: 'string', format: 'date-time' },
            submission_deadline: { type: 'string', format: 'date-time' }
          }
        },
        Bid: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            tender_id: { type: 'string' },
            vendor_id: { type: 'string' },
            total_bid_amount: { type: 'number' },
            status: { 
              type: 'string', 
              enum: ['submitted', 'under_review', 'accepted', 'rejected', 'withdrawn'] 
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
