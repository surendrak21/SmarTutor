const mongoose = require('mongoose');

const DB = process.env.DATABASE;
mongoose.connect(DB, { useNewUrlParser: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo error:', err.message));
