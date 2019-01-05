'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
const { mongoose } = require('./db/mongoose');
const { Url } = require('./models/url');

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', async (req, res) => {
  try {
    const body = {};
    body.original_url = req.body.url;
    const prevUrlEntry = Url.find({ original_url: body.original_url });
    if (prevUrlEntry[0]) {
      res.send(prevUrlEntry);
    } else {
      let count = 0;
      Url.find().exec(function (err, results) {
        count = results.length
      });
      console.log(count);
      body.short_url = count + 1;
      const url = new Url(body);
      await url.save();
      res.send(url);
    }
  } catch (e) {
    console.log(e);
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});