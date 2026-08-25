'use strict';

/**
 * Gera um middleware de validação a partir de um schema Zod.
 * `source` indica qual parte da requisição validar: 'body' | 'params' | 'query'.
 *
 * Em caso de sucesso, substitui req[source] pelo dado já parseado/tipado
 * pelo Zod (ex: strings numéricas de params viram number).
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const issues = result.error.issues.map((i) => ({
        campo: i.path.join('.'),
        mensagem: i.message,
      }));
      return res.status(422).json({ message: 'Dados inválidos.', issues });
    }

    req[source] = result.data;
    return next();
  };
}

module.exports = validate;
