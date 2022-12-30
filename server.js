//declaring variables needed for express and require methods. and uuidv4
const express = require('express');
const path = require('path');
const app = express();
const PORT =  process.env.PORT || 3001;
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('Develop/public'));


//the default landing page with no requests
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);
//makes a get route for /notes. and sends the file notes.html dispaying that as the page. with all the saved notes
app.get('/notes', (req, res) => {
  console.info(`GET /api/notes`);
  res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
});
//makes a get route for /api/notes and reads the notes.json file on that page showing that raw data
app.get('/api/notes', (req, res) => {
  fs.readFile("Develop/db/notes.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data))
  })
})
//when get request doesnt exist defaults to indiex.html
app.get("*", (req, res) =>
res.sendFile(path.join(__dirname, 'Develop/public/index.html'))
);
// a post request on /api/notes. when the user provides a title and text it will save that note
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  // if the user entered a title and text save it in a new variable
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    }
//reads the notes.json file and parses it then saves it to a variable
    fs.readFile("Develop/db/notes.json", "utf8", (err, data) => {
      if (err) throw err;
      let notesDb = JSON.parse(data)
// then pushes the newNote variable into that file.
      notesDb.push(newNote)
//then over writes the old notes.json file with the new info from notesDb
      fs.writeFile("Develop/db/notes.json", JSON.stringify(notesDb), (err) => {
        if (err) throw err;
        console.log("new note created")
      })
      // added this to automatically send the user to the notes.html page after
      res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
    })
  }
});
// created a delete route for /api/notes/:id
app.delete("/api/notes/:id", (req, res) => {
  //saves the :id entered into a variable "clickedNote"
  let clickedNote = req.params.id
  fs.readFile("Develop/db/notes.json", "utf8", (err, data) => {
    if (err) throw err;
    let notesDb = JSON.parse(data)
    // if the notes id in notesDb are not the one selected/clicked save to newNotesDb
    let newNotesDb = notesDb.filter(note => note.id !== clickedNote)
    //write file with newNotesDb in notes.json
    fs.writeFile("Develop/db/notes.json", JSON.stringify(newNotesDb), (err) => {
      if (err) throw err;
      console.log("noted deleted")
    })
    res.sendFile(path.join(__dirname, 'Develop/public/notes.html'))
  })
})
//listens for port connections
app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);