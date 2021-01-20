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
        
        reqJson.id = uuidv4();    // assign a uuid to the reqJson
        dbFile.push(reqJson);  // appends req.body json
        
        // Parse the dbFile object, check for missing id keys and add if necessary
        for (const objEntry of dbFile) {
            if( objEntry.hasOwnProperty('id') ) {
                console.log(objEntry);
            }
            else {  // id property missing? add a uuid then.
                console.log(`[!] id missing, adding uuid...`);
                objEntry.id = uuidv4();
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
    // src: https://expressjs.com/en/guide/routing.html
    // ROUTE PARAMETERS `/:id` are named URL segments used to store values
    // in the URL.  These values are stored in the req.params object.
    // Route path: /users/:userID/books/:bookId
    // Request URL: http://localhost:3000/users/34/books/8989
    // req.params: `{ "userID": "34", "bookId": "8989" }

    let dbFile = "";
    dbFileModified = new Array();    // Object to store updated dbFile sans deleted element
    let reqJson = req.body;

    // Read db/db.json, parse it and log.
    fs.readFile(path.join(__dirname, `db/db.json`), `utf8`, (err, data) => {
        if (err) throw err;
        
        dbFile = JSON.parse(data);  // dbFile is now an object.
        
        // Parse the dbFile object, check for missing id keys and add if necessary
        let dbFileDeleteIndex = null;
        // https://flaviocopes.com/how-to-get-index-in-for-of-loop/
        for (const [index, objEntry] of dbFile.entries() ) {
            if( objEntry.hasOwnProperty('id') ) {
                if( objEntry.id === req.params.id ) {
                    console.log(`[+] id to delete FOUND`);
                    dbFileDeleteIndex = index;
                } else {
                    console.log(`[.] id to delete does not match, pushing...`);
                    dbFileModified.push(objEntry);  // push non-matching object to object-to-write
                }
            }
        }

        // If we got a DELETE ID MATCH, then we have things to update
        if (dbFileDeleteIndex !== null) {
            console.log(`[!] delete index was STORED, is: ${dbFileDeleteIndex}`);

            // Display the dbFile to be written
            console.log(`[i] dbFileModified contents:\n`);
            console.log(dbFileModified);
                    
            // Write the updated data to the server-side db.json file
            fs.writeFile(
                path.join(__dirname, `db/db.json`),
                JSON.stringify(dbFileModified),
                `utf8`,
                (err) => {
                    if (err) throw err;
                    console.log(`[+] wFile success: db.json`);
                }
            );

            // Close out the POST request w/ response.
            res.send("DELETE success");

        } 
        else {    // If there was NO MATCH then nothing needs to change.
            console.log(`[e] delete index NOT FOUND`);
            // Close out the POST request w/ response.
            res.send(`DELETE UUID matched no records`);
        }
        
    });
});

// This route allows the existing js code to load correctly
app.get(`/assets/js/index.js`, (req, res) => {
    res.sendFile(path.join(__dirname, `public/assets/js/`, `index.js`), (err) => {
        if (err) {
            throw err;
            console.log(err);
        } else {
            console.log("[+] Serving ./public/assets/js/index.js");
        }
    });
})

// Required for heroku
app.get("/", function(req, res) {
    //res.json(path.join(__dirname, "public/index.html"));
    // Should return the 'index.html' file.
    res.sendFile(path.join(__dirname, `public/`, `index.html`), (err) => {
        if (err) {
            throw err;
            console.log(err);
        } else {
            console.log("[+] Serving ./public/index.html");
        }
    });
});

// app.get * route has to be at the bottom
app.get(`*`, (req, res) => {
    // Should return the 'index.html' file.
    res.sendFile(path.join(__dirname, `public/`, `index.html`), (err) => {
        if (err) {
            throw err;
            console.log(err);
        } else {
            console.log("[+] Serving ./public/index.html");
        }
    });

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});