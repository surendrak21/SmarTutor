// backend/app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

require('./db/conn');                 // 1) connect Mongo FIRST

// 2) core middlewares – MUST come before routes
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// 3) routes – AFTER middlewares
app.use(require('./router/auth'));     // auth routes
app.use(require('./router/prereg'));   // prereg routes (needs cookieParser)

// (optional) health
app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
