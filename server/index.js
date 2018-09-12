
// Basic express setup:

const MONGODB_URI = 'mongodb://localhost:27017/tweeter';
const PORT = 8080;
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const DH = require('./lib/data-helpers.js');
const TR = require('./routes/tweets');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let DataHelpers;
let tweetsRoutes;

MongoClient.connect(MONGODB_URI)
  .then((db) => {
    DataHelpers = DH(db);
    tweetsRoutes = TR(DataHelpers);
    app.use('/tweets', tweetsRoutes);
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  });
