'use strict';

const userService = require('../services/user.service');
const asyncHandler = require('../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const users = await userService.list();
  res.json(users);
});

const me = asyncHandler(async (req, res) => {
  const user = await userService.getById(req.user.id);
  res.json(user);
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.json(user);
});

const changeMyPassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  res.json({ message: 'Senha alterada com sucesso.' });
});

const create = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json(user);
});

const remove = asyncHandler(async (req, res) => {
  await userService.remove(req.params.id, req.user.id);
  res.status(204).send();
});

module.exports = { list, me, updateMe, changeMyPassword, create, remove };
