'use strict';

const { verifyToken } = require('../utils/jwt');

/**
 * Exige um JWT válido no header Authorization: Bearer <token>.
 * Em caso de sucesso, popula req.user = { id, role }.
 */
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não informado.' });
  }

  const token = header.substring('Bearer '.length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;
