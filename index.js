const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataPath = path.join(__dirname, 'lectures.json');

const loadLectures = () => {
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]');
  }
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

const saveLectures = (lectures) => {
  fs.writeFileSync(dataPath, JSON.stringify(lectures, null, 2), 'utf-8');
};

app.get('/api/lectures', (req, res) => {
  try {
    const lectures = loadLectures();
    res.json(lectures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load lectures' });
  }
});

app.post('/api/lectures', (req, res) => {
  const { title, subject, type, url, date } = req.body;

  if (!title || !subject || !type || !url || !date) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const lectures = loadLectures();
    lectures.push({ title, subject, type, url, date });
    saveLectures(lectures);
    res.json({ message: 'Lecture added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save lecture' });
  }
});

module.exports = app;

