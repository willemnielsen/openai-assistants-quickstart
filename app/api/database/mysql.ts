// pages/api/mysql.js
import mysql from 'mysql2';

// Create the connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',   // or your host name (if it's not running locally)
  user: 'root',        // MySQL username
  password: 'your_password', // MySQL password
  database: 'your_database'  // The database name
});

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Example of selecting data from the database
    db.query('SELECT * FROM your_table', (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json(results);
    });
  } else {
    res.status(405).json({ message: 'Only GET method is allowed' });
  }
}
