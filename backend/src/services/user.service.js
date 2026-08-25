'use strict';

const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');

const SALT_ROUNDS = 10;

async function list() {
  return userRepository.findAll();
}

async function getById(id) {
  const user = await userRepository.findById(id);
  if (!user) throw new AppError('Usuário não encontrado.', 404);
  return user;
}

async function create({ name, email, senha, role }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) throw new AppError('Já existe um usuário com este e-mail.', 409);

  const passwordHash = await bcrypt.hash(senha, SALT_ROUNDS);
  return userRepository.create({ name, email, passwordHash, role });
}

async function updateProfile(id, { name, email }) {
  if (email) {
    const existing = await userRepository.findByEmail(email);
    if (existing && existing.id !== id) {
      throw new AppError('Este e-mail já está em uso.', 409);
    }
  }
  const updated = await userRepository.updateProfile(id, { name, email });
  if (!updated) throw new AppError('Usuário não encontrado.', 404);
  return updated;
}

async function changePassword(id, { senhaAtual, novaSenha }) {
  const user = await userRepository.findByEmailWithPassword((await getById(id)).email);
  const senhaValida = await bcrypt.compare(senhaAtual, user.password_hash);
  if (!senhaValida) throw new AppError('Senha atual incorreta.', 401);

  const novoHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
  await userRepository.updatePassword(id, novoHash);
}

async function remove(id, requesterId) {
  if (Number(id) === Number(requesterId)) {
    throw new AppError('Você não pode excluir seu próprio usuário.', 400);
  }
  const removed = await userRepository.remove(id);
  if (!removed) throw new AppError('Usuário não encontrado.', 404);
}

module.exports = { list, getById, create, updateProfile, changePassword, remove };
