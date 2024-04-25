const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Loki74Lover7474*',
  database: 'running'
});

app.post('/addRun', (req, res) => {
  const { time, distance } = req.body;
    const sql = 'INSERT INTO runs (time, distance) VALUES (?, ?)';
db.query(sql, [time, distance], (err, result) => {
if (err) throw err;
res.json({ message: 'Run added successfully' });
  });
});

app.get('/getRuns', (req, res) => {
  const sql = 'SELECT * FROM runs';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.delete('/clearRuns', (req, res) => {
  const sql = 'DELETE FROM runs';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: 'All runs cleared' });
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});