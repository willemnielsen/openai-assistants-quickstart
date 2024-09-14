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
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  if (!query) {
    return new Response('Search query is required', { status: 400 });
  }

  try {
    // Use pool.query directly instead of getting a client
    const [rows] = await pool.query(
      'SELECT * FROM customers WHERE last_name LIKE ? LIMIT 5',
      [`%${query}%`]
    );
    return Response.json(rows);
  } catch (error) {
    console.error('Error searching data:', error);
    return new Response('Error searching data', { status: 500 });
  }
}

// ... POST and DELETE functions would be similarly modified