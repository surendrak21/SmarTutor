

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path'); // Path is imported, so no ReferenceError

const app = express();

// connect to MongoDB
require('./db/conn');

// middleware
app.use(express.json());       
app.use(cookieParser());       

// CORS for React dev server
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

// API routes
app.use(require('./router/auth'));
app.use(require('./router/prereg'));

// simple health check / debug route
app.get('/', (req, res) => {
  res.send('Hello from SmartTutor backend ✅');
});


// ----------------------------------------------------------------
// --- MANDATORY CODE FOR SERVING REACT FRONTEND IN PRODUCTION ---
// ----------------------------------------------------------------

// '..': Yeh backend folder se ek level upar (CS253-main folder) tak jaata hai.
const rootDir = path.join(__dirname, '..'); 

// Serve static assets from the client/build folder
app.use(express.static(path.join(rootDir, "client/build")));

// Catch-all route: Saari baaki requests ke liye index.html file serve karega.
app.get("*", (req, res) => {
  // .resolve() is safer than .join() for final file pathing
  res.sendFile(path.resolve(rootDir, "client", "build", "index.html"));
});

// ----------------------------------------------------------------

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
