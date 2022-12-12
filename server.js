
// running express, application, fs, and port//
const { json } = require('express');
const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3001;

//handling data parsing//

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

// routes

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "public/index.html"));
});


app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req, res){
    res.sendFile(path.join(__dirname,"db/db.json"));
});

//takes a json input with "title" and "text" to add to the note object with that message to db.json

app.post("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, "db/db.json"), "utf8", function(error, response){
        if (error) {
            console.log(error);
        }
        const notes = JSON.parse(response);
        const noteRequest = req.body;
        const newNoteId = notes.length + 1;
        const newNote = {
            id: newNoteId,
            title: noteRequest.title,
            text: noteRequest.text
        };
        notes.push(newNote);
        res.json(newNote);
        fs.writeFile(path.join(__dirname, "db/db.json"), JSON.stringtify(notes, null, 2), function(err) {
            if (err) throw err;
        });
    });
});

//deletes the note with requested id from db.json file, with a false msg if id does not exist
app.delete("/api/notes/:id", function(req, res){
    const deleteId = req.params.id;
    fs.readFile("db/db.json", "utf8", function(error, response){
        if (error) {
            console.log(error);
        }
        let notes = JSON.parse(response);
        if (deleteId <= notes.length) {
            res.json(notes.splice(deleteId-1,1));

        for (let i=0; i<notes.length; i++) {
            notes[i].id = i+1;
        }
        fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), function(err){
            if (err) throw err;
        });
    } else {
        res.json(false);
    }

    });

});


// starts the server to begin listening

app.listen(3001, function() {
    console.log("App listening on PORT" + 3001);
});




