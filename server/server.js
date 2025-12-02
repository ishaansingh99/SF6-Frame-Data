const express = require('express');
const cors = require('cors');
const frameData = require('./framedata/SF6FrameData.json');
const routes = require('./routes/routes.js');
require('dotenv').config();
// const jwt = require('jsonwebtoken');
// const session = require('express-session');
// const path = require('path');
// const mongoose = require('mongoose');

const app = express();
const PORT = process.env.REACT_APP_PORT || 3001;
// const SECRET_KEY = 'your_secret_key';

// mongoose.set('strictQuery', false);

// const uri =  "mongodb://root:<replace password>@localhost:27017";
// mongoose.connect(uri,{'dbName':'SocialDB'});

// const User = mongoose.model('User', { username: String, email: String, password: String });
// const Post = mongoose.model('Post', { userId: mongoose.Schema.Types.ObjectId, text: String });

app.use(express());
app.use(cors());
app.use('/', routes);
// Separate routing functions into separate files
// Routing for finding all chars
// Routing for all moves on one char

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello from Express server!');
});

app.get('/chars', (req, res) => {
  // Sample data for SF6 characters
  const chars = Object.keys(frameData);
  res.json(chars);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));