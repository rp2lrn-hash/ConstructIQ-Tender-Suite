const tenantIsolation = (req, res, next) => {
  if (!req.customerId) {
    return res.status(400).json({ error: 'Customer ID required' });
  }

  req.tenantFilter = { customer_id: req.customerId };
  next();
};

const auditLog = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = async function(data) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const { AuditLog } = require('../models');
        
        try {
          await AuditLog.create({
            user_id: req.user?.id,
            customer_id: req.customerId,
            action,
            entity_type: req.route?.path?.split('/')[1] || 'unknown',
            entity_id: req.params?.id,
            old_values: req.oldValues || null,
            new_values: req.body || null,
            ip_address: req.ip,
            user_agent: req.get('user-agent')
          });
        } catch (error) {
          console.error('Audit log error:', error);
        }
      }
      
      originalSend.call(this, data);
    };
    
    next();
  };
};

module.exports = {
  tenantIsolation,
  auditLog
};
