'use strict';

function getStockStatus(quantity) {
  if (quantity <= 10) return 'CRITICO';
  if (quantity <= 60) return 'BAIXO';
  return 'EM_ESTOQUE';
}

module.exports = { getStockStatus };
