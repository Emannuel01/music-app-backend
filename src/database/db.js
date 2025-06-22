const { Pool } = require('pg');

// O Pool usa a variável de ambiente DATABASE_URL que definimos no docker-compose.yml
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});


const query = (text, params) => pool.query(text, params);

module.exports = { query };