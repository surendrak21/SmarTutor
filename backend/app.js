require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

require('./db/conn');                // connect to Mongo

// parsers FIRST
app.use(express.json());             // parse JSON body
app.use(cookieParser());             // cookies

// CORS for React dev server with cookies
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


app.use(require('./router/auth'));
app.use(require('./router/prereg'));

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});


app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});
