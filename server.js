// includes
const express = require(`express`);
const path = require(`path`);
const fs = require(`fs`);
// https://github.com/uuidjs/uuid
// Call with `uuidv4();` returns something akin to:
// 0818bab7-a1a9-44da-ab52-d3fa89a6461f
const { v4: uuidv4 } = require(`uuid`);

// Main express.js object instance
const app = express();

// The port to listen on
const PORT = process.env.PORT || 8080;

// Express.js middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/////////////////
// HTML ROUTES //
/////////////////
app.get(`/notes`, (req, res) => {
    // This route is to return the 'index.html' file
    res.sendFile(path.join(__dirname, 'public/', '/notes.html'));
    console.log(req.body);
});

////////////////
// API ROUTES //
////////////////

// GET `/api/notes`
app.get(`/api/notes`, (req, res) => {
    // Should read the `db.json` file and
    // return all saved notes as JSON
    res.sendFile(path.join(__dirname, `db/db.json`));
});

// app.get * route has to be at the bottom
app.get(`*`, (req, res) => {
    // Should return the 'index.html' file.
    res.sendFile(
        path.join(__dirname, `public/`, `/index.html`));
});

// POST `/api/notes`
// Should receive a new note to save on the request body,
// add it to the `db.json` file, and then
// return the new note to the client.
app.post(`/api/notes`, (req, res) => {
    let dbFile = "";
    let reqJson = req.body;
        
    // Read db/db.json, parse it and log.
    fs.readFile(path.join(__dirname, `db/db.json`), `utf8`, (err, data) => {
        if (err) throw err;
        dbFile = JSON.parse(data);  //dbFile is now an object.
        
        reqJson.uuid = uuidv4();    // assign a uuid to the reqJson
        dbFile.push(reqJson);  // appends req.body json
        
        // Parse the dbFile object, check for missing id keys and add if necessary
        for (const objEntry of dbFile) {
            if( objEntry.hasOwnProperty('uuid') ) {
                console.log(objEntry);
            }
            else {  // uuid property missing? add a uuid then.
                console.log(`[!] uuid missing, adding uuid...`);
                objEntry.uuid = uuidv4();
                console.log(objEntry);
            }
        }
        
        // Display the dbFile to be written
        console.log(`[i] dbFile contents:\n`);
        console.log(dbFile);
                
        // Write the updated data to the server-side db.json file
        fs.writeFile(
            path.join(__dirname, `db/db.json`),
            JSON.stringify(dbFile),
            `utf8`,
            (err) => {
                if (err) throw err;
                console.log(`[+] wFile success: db.json`);
            }
        );

        // Close out the POST request w/ response.
        res.send(req.body);
    });
});

// DELETE `/api/notes/:id`
// Should receive a query parameter containing the id of a note to delete.
// This means one shall need to find a way to give each note a unique `id` when it is saved.
// In order to delete a note, one will need to:
// - read all notes from the `db.json` file,
// - remove the note with the given `id` property, and then
// - rewrite the notes to the `db.json` file.
app.delete(`/api/notes/:id`, (req, res) => {

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});