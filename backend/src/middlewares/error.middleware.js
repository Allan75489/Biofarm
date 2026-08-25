'use strict';

const AppError = require('../utils/AppError');

/**
 * Middleware de erro do Express (4 argumentos).
 * Deve ser o último middleware registrado em app.js.
 */
// eslint-disable-next-line no-unused-vars
function errorMiddleware(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  // Violação de UNIQUE constraint do MySQL
  if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
    return res.status(409).json({ message: 'Registro já existe.' });
  }

  // Violação de FOREIGN KEY do MySQL (inserção/atualização referenciando
  // registro inexistente, ou exclusão de registro ainda referenciado)
  if (
    err.code === 'ER_NO_REFERENCED_ROW' ||
    err.code === 'ER_NO_REFERENCED_ROW_2' ||
    err.code === 'ER_ROW_IS_REFERENCED' ||
    err.code === 'ER_ROW_IS_REFERENCED_2' ||
    err.errno === 1451 ||
    err.errno === 1452
  ) {
    return res.status(409).json({ message: 'Operação viola uma referência existente.' });
  }

  console.error('[Erro não tratado]', err);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
}

module.exports = errorMiddleware;
