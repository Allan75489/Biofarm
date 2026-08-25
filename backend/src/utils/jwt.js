'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Gera um JWT contendo o id e a role do usuário.
 * Mantém o payload mínimo — dados completos vêm de /api/users/me.
 */
function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

/**
 * Verifica um token e retorna o payload decodificado.
 * Lança erro se o token for inválido ou expirado.
 */
function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { signToken, verifyToken };
