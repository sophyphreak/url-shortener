'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const isValidHttpUrl = require('is-valid-http-url');

const cors = require('cors');

const app = express();
const { mongoose } = require('./db/mongoose');
const { Url } = require('./models/url');

app.use(cors());

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/').get((req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.route('/api/shorturl/:short_url').get(async (req, res) => {
  const short_url = req.params.short_url;
  const url = await Url.findOne({short_url: short_url});
  const original_url = url.original_url;
  res.redirect(original_url);
})

app.post('/api/shorturl/new', async (req, res) => {
  try {
    let prevUrlEntry;
    const body = {};
    body.original_url = req.body.url;
    if (!isValidHttpUrl(body.original_url)) {
      res.send({"error":"invalid URL"})
    } else {
      prevUrlEntry = await Url.find({ original_url: body.original_url });
      if (prevUrlEntry[0]) {
        const {original_url, short_url} = prevUrlEntry[0];
        res.send({original_url, short_url});
      } else {
        const urls = await Url.find({});
        const count = urls.length;
        body.short_url = count + 1;
        const url = new Url(body);
        await url.save();
        const {original_url, short_url} = url;
        res.send({original_url, short_url});
      }
    }
  } catch (e) {
    console.log(e);
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});