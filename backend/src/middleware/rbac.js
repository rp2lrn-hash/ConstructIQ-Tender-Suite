const rbac = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

const authorize = rbac;
const isAdmin = rbac(['admin']);
const isEvaluator = rbac(['admin', 'evaluator']);
const isVendor = rbac(['admin', 'vendor']);
const isCustomerUser = rbac(['admin', 'evaluator', 'customer_user']);
const isAnyAuthenticated = rbac(['admin', 'evaluator', 'vendor', 'customer_user']);

module.exports = {
  rbac,
  authorize,
  isAdmin,
  isEvaluator,
  isVendor,
  isCustomerUser,
  isAnyAuthenticated
};
