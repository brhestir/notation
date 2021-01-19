const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/test/", (req, res) => {
    console.log(req.body);
});

app.post("/api/test", (req, res) => {

});

// app.get star route has to be at the bottom
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});