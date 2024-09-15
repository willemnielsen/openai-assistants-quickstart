const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

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

async function bulkUpdate(data) {
  const connection = await getConnection();
  try {
    const placeholders = data.map(() => '(?, ?)').join(', ');
    const sql = `
      INSERT INTO customers (customer_id, gender)
      VALUES ${placeholders}
      ON DUPLICATE KEY UPDATE gender = VALUES(gender)
    `;
    const values = data.flatMap(({ CID, Gender }) => [parseInt(CID, 10), Gender]);
    const [result] = await connection.query(sql, values);
    console.log(`Updated ${result.affectedRows} rows`);
  } finally {
    connection.release();
  }
}

async function importCSVData(filePath) {
  const csvData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.CID && row.Gender) {
          csvData.push({ CID: row.CID, Gender: row.Gender });
        }
      })
      .on('end', () => resolve(csvData))
      .on('error', reject);
  });
}

async function main() {
  try {
    const fileName = 'AllFBCustomers-09_14_2024_11_19am.csv';
    const filePath = path.join(process.cwd(), 'app/utils/', fileName);
    const csvData = await importCSVData(filePath);

    const batchSize = 1000;
    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      await bulkUpdate(batch);
    }

    console.log('Bulk update completed successfully');
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

async function createFullTextIndex() {
  const connection = await getConnection();
  const searchInput = 'wil nie';
  const searchTerms = searchInput.trim().split(/\s+/).map(term => `%${term}%`);
  let query, params;

  if (searchTerms.length > 1) {
    query = `
    SELECT *
    FROM customers
    WHERE first_name LIKE ? AND last_name LIKE ?
    LIMIT 5
    `;
    params = [searchTerms[0], searchTerms[1]];
  } else {
    query = `
    SELECT *
    FROM customers
    WHERE last_name LIKE ? 
    OR first_name LIKE ?
    OR full_name LIKE ?
    OR email LIKE ?
    OR phone_day LIKE ?
    OR birthdate LIKE ?
    OR customer_id LIKE ?
    LIMIT 5
    `;
    params = Array(7).fill(searchTerms[0]);
  }

  console.log(query, params);

  try {
    const [rows] = await connection.query(query, params);
    console.log('Search results:', rows);
  } catch (error) {
    console.error('Error searching customers:', error);
  } finally {
    connection.release();
  }
}

// Call createFullTextIndex() and end the program
createFullTextIndex().then(() => {
  console.log('Program execution completed.');
  process.exit(0);
}).catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});

// Remove or comment out the main() function call if it exists
// main();



