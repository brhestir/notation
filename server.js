const express = require(`express`);
const path = require(`path`);

const app = express();

const PORT = process.env.PORT || 8080;

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
    // Should read the `db.json` file and return all saved notes as JSON
    

});

// app.get * route has to be at the bottom
app.get(`*`, (req, res) => {
    // Should return the 'index.html' file.
    res.sendFile(path.join(__dirname, 'public/', "/index.html"));
});

// POST `/api/notes`
// Should receive a new note to save on the request body,
// add it to the `db.json` file, and then
// return the new note to the client.
app.post(`api/notes`, (req, res) => {

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