const mongoose = require('mongoose');

const Url = mongoose.model('Url', {
  original_url: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  short_url: {
    type: Number,
    required: true
  }
});

module.exports = {
  Url
};
