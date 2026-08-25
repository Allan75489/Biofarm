'use strict';

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const { signToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

async function login({ email, senha }) {
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const senhaValida = await bcrypt.compare(senha, user.password_hash);
  if (!senhaValida) {
    throw new AppError('Credenciais inválidas.', 401);
  }

  const token = signToken(user);

  return {
    token,
    usuario: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

module.exports = { login };
