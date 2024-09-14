const mysql = require('mysql2/promise');


// Database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Nola@1125',
  database: 'dash',
  port: 3306
};

let pool;

async function getConnection() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool.getConnection();
}

async function query(sql, params) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, params);
    return results;
  } finally {
    connection.release();
  }
}

// Execute the query and return results
async function main() {
  try {
    const results = await query('SELECT * FROM customers LIMIT 5');
    console.log(results);
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

main();