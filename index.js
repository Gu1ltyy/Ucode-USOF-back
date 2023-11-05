const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const PORT = 3001;
const URL = 'http://localhost:3000';

const db = require("./db/db.js");
const router = require("./routes/router.js");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(cors({
    credentials: true,
    origin: URL,
    methods:["GET" , "POST" , "PATCH", "DELETE"],
    optionSuccessStatus:200
}));

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));