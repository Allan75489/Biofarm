'use strict';

const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2, 'Nome muito curto.').max(120),
  email: z.string().email('E-mail inválido.'),
  senha: z.string().min(6, 'A senha deve ter ao menos 6 caracteres.'),
  role: z.enum(['ADMIN', 'USER']).optional().default('USER'),
});

const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email('E-mail inválido.').optional(),
});

const changePasswordSchema = z
  .object({
    senhaAtual: z.string().min(1, 'Informe a senha atual.'),
    novaSenha: z.string().min(6, 'A nova senha deve ter ao menos 6 caracteres.'),
    confirmarSenha: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  });

module.exports = {
  createUserSchema,
  updateProfileSchema,
  changePasswordSchema,
};
