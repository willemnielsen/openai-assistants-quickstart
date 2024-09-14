const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
console.log('File path:', path.join(process.cwd(), '/app/utils/AllFBCustomers-09_14_2024_11_19am.csv'));


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
    console.log('Database connection pool created successfully');
  }
  const connection = await pool.getConnection();
  console.log('Database connection acquired successfully');
  return connection;
}

async function query(sql, params) {
  const connection = await getConnection();
  try {
    const [results] = await connection.query(sql, params);
    console.log(results);
    return results;
  } finally {
    connection.release();
  }
}

// Execute the query and return results
async function main() {
  try {
    // First, add the 'gender' column to the customers table
    // await query(`
    //   ALTER TABLE customers
    //   ADD COLUMN gender VARCHAR(10)
    // `);
    // console.log('Gender column added successfully');

    const fileName = 'AllFBCustomers-09_14_2024_11_19am.csv';
    const filePath = path.join(process.cwd(), 'app/utils/', fileName);
    // Import CSV data using the helper function
    const csvData = await importCSVData(filePath);

    // Update gender values in the database
    for (const row of csvData) {
      const { CID, Gender } = row;
      if (CID && Gender) {
        const updateQuery = `
          UPDATE customers
          SET gender = ?
          WHERE id = ?
        `;
        await query(updateQuery, [Gender, parseInt(CID, 10)]);
      }
    }

    console.log('Gender values updated successfully');

    // Fetch and log a sample of updated results
    const results = await query('SELECT * FROM customers WHERE gender IS NOT NULL LIMIT 10');
    console.log('Sample of updated customers:', results);
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
}

async function importCSVData(filePath) {
  const csvData = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        csvData.push(row);
      })
      .on('end', () => resolve(csvData))
      .on('error', reject);
  });
}

main();
