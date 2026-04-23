const bcrypt = require('bcryptjs');
const { sequelize, Customer, User, Tender, Vendor, Bid, Evaluation, Contract } = require('../models');

const seedData = async () => {
  try {
    console.log('Starting database seed...');

    await sequelize.sync({ force: true });
    console.log('Database synced.');

    // Create customers
    const customers = await Customer.bulkCreate([
      {
        name: 'Acme Construction Corp',
        industry: 'Construction',
        contact_email: 'contact@acme.com',
        contact_phone: '+1-555-0100',
        address: '123 Main St, New York, NY',
        status: 'active'
      },
      {
        name: 'BuildRight Industries',
        industry: 'Manufacturing',
        contact_email: 'info@buildright.com',
        contact_phone: '+1-555-0200',
        address: '456 Oak Ave, Los Angeles, CA',
        status: 'active'
      },
      {
        name: 'TechSolutions Ltd',
        industry: 'Technology',
        contact_email: 'admin@techsolutions.com',
        contact_phone: '+1-555-0300',
        address: '789 Tech Blvd, San Francisco, CA',
        status: 'active'
      }
    ]);

    console.log('Customers created.');

    // Create users - model hooks will hash passwords automatically
    const users = await User.bulkCreate([
      {
        customer_id: customers[0].id,
        role: 'admin',
        name: 'Admin User',
        email: 'admin@acme.com',
        password_hash: 'Admin@123',
        phone: '+1-555-0101',
        status: 'active'
      },
      {
        customer_id: customers[0].id,
        role: 'evaluator',
        name: 'John Evaluator',
        email: 'john@acme.com',
        password_hash: 'Eval@123',
        phone: '+1-555-0102',
        status: 'active'
      },
      {
        customer_id: customers[0].id,
        role: 'customer_user',
        name: 'Jane Customer',
        email: 'jane@acme.com',
        password_hash: 'User@123',
        phone: '+1-555-0103',
        status: 'active'
      },
      {
        customer_id: customers[1].id,
        role: 'admin',
        name: 'BuildRight Admin',
        email: 'admin@buildright.com',
        password_hash: 'Admin@123',
        phone: '+1-555-0201',
        status: 'active'
      },
      {
        customer_id: customers[2].id,
        role: 'admin',
        name: 'TechSolutions Admin',
        email: 'admin@techsolutions.com',
        password_hash: 'Admin@123',
        phone: '+1-555-0301',
        status: 'active'
      }
    ], { individualHooks: true });

    console.log('Users created.');

    // Create vendors
    const vendors = await Vendor.bulkCreate([
      {
        customer_id: customers[0].id,
        name: 'Prime Contractors Inc',
        license_no: 'LIC-001-ACME',
        certifications: ['ISO 9001', 'OSHA Certified'],
        contact_email: 'sales@primecontractors.com',
        contact_phone: '+1-555-1001',
        address: '100 Vendor St, New York, NY',
        business_type: 'General Contractor',
        years_in_business: 15,
        compliance_status: 'compliant',
        status: 'active',
        rating: 4.5
      },
      {
        customer_id: customers[0].id,
        name: 'Elite Builders Ltd',
        license_no: 'LIC-002-ACME',
        certifications: ['LEED Certified', 'ISO 14001'],
        contact_email: 'info@elitebuilders.com',
        contact_phone: '+1-555-1002',
        address: '200 Builder Ave, New York, NY',
        business_type: 'Specialty Contractor',
        years_in_business: 10,
        compliance_status: 'compliant',
        status: 'active',
        rating: 4.2
      },
      {
        customer_id: customers[1].id,
        name: 'Global Supply Co',
        license_no: 'LIC-001-BUILD',
        certifications: ['ISO 9001'],
        contact_email: 'orders@globalsupply.com',
        contact_phone: '+1-555-2001',
        address: '300 Supply Rd, Los Angeles, CA',
        business_type: 'Material Supplier',
        years_in_business: 20,
        compliance_status: 'compliant',
        status: 'active',
        rating: 4.7
      }
    ]);

    console.log('Vendors created.');

    // Create tenders
    const tenders = await Tender.bulkCreate([
      {
        customer_id: customers[0].id,
        title: 'Office Building Construction Project',
        description: 'Construction of a 10-story office building with modern amenities and green building certification.',
        category: 'Construction',
        budget_range_min: 5000000,
        budget_range_max: 7500000,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        submission_deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'published',
        created_by: users[0].id,
        requirements: [
          'Minimum 10 years experience in commercial construction',
          'LEED Silver certification or higher',
          'Bonding capacity of $5M+'
        ],
        evaluation_criteria: {
          technical: 0.4,
          financial: 0.4,
          compliance: 0.2
        },
        documents: []
      },
      {
        customer_id: customers[0].id,
        title: 'IT Infrastructure Upgrade',
        description: 'Complete overhaul of IT infrastructure including servers, networking, and security systems.',
        category: 'Technology',
        budget_range_min: 500000,
        budget_range_max: 800000,
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        submission_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'published',
        created_by: users[0].id,
        requirements: [
          'Cisco certified partners preferred',
          '24/7 support capability',
          'ISO 27001 compliance'
        ],
        evaluation_criteria: {
          technical: 0.5,
          financial: 0.3,
          compliance: 0.2
        },
        documents: []
      },
      {
        customer_id: customers[1].id,
        title: 'Steel Supply Contract',
        description: 'Annual supply contract for structural steel materials.',
        category: 'Materials',
        budget_range_min: 2000000,
        budget_range_max: 3000000,
        deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        submission_deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        status: 'published',
        created_by: users[3].id,
        requirements: [
          'ASTM certified materials',
          'Just-in-time delivery capability',
          'Quality assurance program'
        ],
        evaluation_criteria: {
          technical: 0.3,
          financial: 0.5,
          compliance: 0.2
        },
        documents: []
      }
    ]);

    console.log('Tenders created.');

    // Create bids
    const bids = await Bid.bulkCreate([
      {
        tender_id: tenders[0].id,
        vendor_id: vendors[0].id,
        customer_id: customers[0].id,
        pricing_details: [
          { item: 'Foundation Work', amount: 1200000 },
          { item: 'Structural Steel', amount: 1800000 },
          { item: 'Interior Finishing', amount: 1500000 },
          { item: 'MEP Systems', amount: 900000 }
        ],
        total_bid_amount: 5400000,
        technical_proposal: 'Comprehensive proposal with detailed timeline and methodology.',
        documents: [],
        status: 'submitted'
      },
      {
        tender_id: tenders[0].id,
        vendor_id: vendors[1].id,
        customer_id: customers[0].id,
        pricing_details: [
          { item: 'Foundation Work', amount: 1300000 },
          { item: 'Structural Steel', amount: 1700000 },
          { item: 'Interior Finishing', amount: 1400000 },
          { item: 'MEP Systems', amount: 850000 }
        ],
        total_bid_amount: 5250000,
        technical_proposal: 'Innovative approach with sustainable materials and energy-efficient design.',
        documents: [],
        status: 'submitted'
      },
      {
        tender_id: tenders[1].id,
        vendor_id: vendors[0].id,
        customer_id: customers[0].id,
        pricing_details: [
          { item: 'Server Infrastructure', amount: 250000 },
          { item: 'Network Equipment', amount: 150000 },
          { item: 'Security Systems', amount: 100000 },
          { item: 'Installation & Setup', amount: 75000 }
        ],
        total_bid_amount: 575000,
        technical_proposal: 'Enterprise-grade solution with redundancy and disaster recovery.',
        documents: [],
        status: 'submitted'
      }
    ]);

    console.log('Bids created.');

    // Create evaluations
    const evaluations = await Evaluation.bulkCreate([
      {
        bid_id: bids[0].id,
        technical_score: 85,
        financial_score: 90,
        compliance_score: 95,
        weighted_score: 88,
        evaluator_id: users[1].id,
        comments: 'Strong technical proposal with competitive pricing.',
        recommendation: 'recommended',
        criteria_breakdown: {
          experience: 90,
          methodology: 85,
          pricing: 90,
          compliance: 95
        }
      },
      {
        bid_id: bids[1].id,
        technical_score: 92,
        financial_score: 88,
        compliance_score: 90,
        weighted_score: 90,
        evaluator_id: users[1].id,
        comments: 'Excellent technical approach with innovative solutions.',
        recommendation: 'recommended',
        criteria_breakdown: {
          experience: 88,
          methodology: 95,
          pricing: 88,
          compliance: 90
        }
      }
    ]);

    console.log('Evaluations created.');

    // Create contract
    const contracts = await Contract.bulkCreate([
      {
        tender_id: tenders[0].id,
        vendor_id: vendors[1].id,
        customer_id: customers[0].id,
        contract_number: 'CTR-2024-001-ACME',
        terms: 'Full construction services as per tender specifications with 18-month completion timeline.',
        contract_value: 5250000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 540 * 24 * 60 * 60 * 1000),
        status: 'active',
        signed_date: new Date(),
        documents: [],
        payment_terms: 'Progress payments: 20% mobilization, 60% progress, 20% completion',
        deliverables: [
          'Foundation completion',
          'Structure completion',
          'Envelope completion',
          'Interior completion',
          'Final handover'
        ]
      }
    ]);

    console.log('Contracts created.');

    console.log('Seed data completed successfully!');
    console.log('\n=== Test Credentials ===');
    console.log('Admin (Acme): admin@acme.com / Admin@123');
    console.log('Evaluator (Acme): john@acme.com / Eval@123');
    console.log('User (Acme): jane@acme.com / User@123');
    console.log('Admin (BuildRight): admin@buildright.com / Admin@123');
    console.log('Admin (TechSolutions): admin@techsolutions.com / Admin@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
