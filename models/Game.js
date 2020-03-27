const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String
  },
  image: {
    type: String
  },
  price: {
    type: Number
  },
  currency: {
    type: String
  },
  stars: {
    type: Number
  },
  reviews: {
    type: Number
  },
  days: {
    type: Number
  },
  category: {
    type: String
  },
  description: {
    type: String
  },
  available_from: {
    type: Date,
    default: Date.now
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Game = mongoose.model('game', GameSchema);