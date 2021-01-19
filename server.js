const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("api/test/", (req, res) => {
    console.log(req.body);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost${PORT}`);
});