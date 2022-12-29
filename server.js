const express = require('express');
const path = require('path');
const noteData = require('./Develop/db/notes.json');
const app = express();
const PORT = 3001;

app.use(express.static('public'));



app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

app.get('/api/notes', (req, res) => {
console.info(`GET /api/notes`);
res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
});


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if(title && text){
    const newNote = {
      title,
      text,
      note_id: "random",
    };
    const response = {
      status: 'success',
      body: newNote,
    };
    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('error posting');
  }
  
  
});
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);