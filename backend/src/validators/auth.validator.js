'use strict';

const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  senha: z.string().min(1, 'Informe a senha.'),
});

module.exports = { loginSchema };
