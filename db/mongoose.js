const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(`mongodb://localhost:27017/ShortUrlTest`);
} else {
  mongoose.connect(
    `mongodb://${process.env.DB_USER}:${
      process.env.DB_PASS
    }@ds227525.mlab.com:27525/short-url`
  );
}

module.exports = { mongoose };
