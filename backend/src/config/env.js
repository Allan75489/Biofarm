'use strict';

require('dotenv').config();

/**
 * Centraliza a leitura das variáveis de ambiente para que o resto
 * da aplicação nunca acesse `process.env` diretamente.
 */
const env = {
  port: Number(process.env.PORT) || 5000,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

if (!env.jwt.secret) {
  console.warn(
    '[config] JWT_SECRET não definido no .env — defina antes de subir para produção.'
  );
}

module.exports = env;
