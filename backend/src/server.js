'use strict';

const app = require('./app');
const env = require('./config/env');

app.listen(env.port, () => {
  console.log(`BioSaúde API rodando em http://localhost:${env.port}`);
});
