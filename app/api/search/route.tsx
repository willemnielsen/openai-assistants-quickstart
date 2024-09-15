import mysql from 'mysql2/promise';

// Create a pool for database connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Nola@1125',
  database: 'dash',
  port: 3306, // Default MySQL port
  connectionLimit: 10 // Adjust based on your needs
});
// Search data in the database
export async function GET(request) {
  console.log('Received GET request:', request.url);

  const url = new URL(request.url);
  console.log('Parsed URL:', url);

  const { searchParams } = url;
  console.log('Search params:', Object.fromEntries(searchParams));

  const query = searchParams.get('query');
  if (!query) {
    return new Response('Search query is required', { status: 400 });
  }

  const searchTerms = query.trim().split(/\s+/).map(term => `%${term}%`);
  const fullQuery = `%${query}%`;

  try {
    let sqlQuery = `
      SELECT * FROM customers 
      WHERE (first_name LIKE ? AND last_name LIKE ?)
      OR full_name LIKE ?
      OR phone_day LIKE ?
      OR email LIKE ?
      OR birthdate LIKE ?
      OR customer_id LIKE ?
      LIMIT 10
    `;

    const params = [
      searchTerms[0] || '', 
      searchTerms[1] || '', 
      fullQuery, 
      fullQuery, 
      fullQuery, 
      fullQuery, 
      fullQuery
    ];

    const [rows] = await pool.query(sqlQuery, params);
    return Response.json(rows);
  } catch (error) {
    console.error('Error searching data:', error);
    return new Response('Error searching data', { status: 500 });
  }
}

// Add a function to end the pool when the server is shutting down
export async function onShutdown() {
  await pool.end();
}
// ... POST and DELETE functions would be similarly modified