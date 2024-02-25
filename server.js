const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3307;

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306, // Default MySQL port is 3306, change to this if your MySQL server is running on port 3306
  user: 'root',
  password: 'Loki74Lover7474*',
  database: 'trackapp',
  connectTimeout: 10000 // 10 seconds
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database as id ' + db.threadId);
});

// Define a sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
