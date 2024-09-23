const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  isGPT: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  messageSchema
};
