'use strict';

/**
 * Restringe o acesso a uma rota a determinadas roles.
 * Deve ser usado sempre depois do authMiddleware.
 *
 * Uso: router.post('/', authMiddleware, requireRole('ADMIN'), controller.create)
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Você não tem permissão para esta ação.' });
    }

    return next();
  };
}

module.exports = requireRole;
