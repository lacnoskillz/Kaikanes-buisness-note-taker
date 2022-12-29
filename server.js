const express = require('express');
const path = require('path');
const noteData = require('./Develop/db/notes.json');
const app = express();
const uuid = require('./helpers/uuid');
const PORT = 3001;
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('Develop/public'));



app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);

app.get('/notes', (req, res) => {
  console.info(`GET /api/notes`);
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
});

app.get('/api/notes', (req, res) => {
  fs.readFile("Develop/db/notes.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data))
  })
})


app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    }

    fs.readFile("Develop/db/notes.json", "utf8", (err, data) => {
      if (err) throw err;
      let notesDb = JSON.parse(data)

      notesDb.push(newNote)

      fs.writeFile("Develop/db/notes.json", JSON.stringify(notesDb), (err) => {
        if (err) throw err;
        console.log("new note created")
      })
      res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
    })
  }
});

app.delete("/api/notes/:id", (req, res) => {
  let clickedNote = req.params.id
  fs.readFile("Develop/db/notes.json", "utf8", (err, data) => {
    if (err) throw err;
    let notesDb = JSON.parse(data)

    let newNotesDb = notesDb.filter(note => note.id !== clickedNote)

    fs.writeFile("Develop/db/notes.json", JSON.stringify(newNotesDb), (err) => {
      if (err) throw err;
      console.log("noted deleted")
    })
    res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
  })
})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);