const mongoose = require("mongoose");

const ipSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  ipSchema
};
