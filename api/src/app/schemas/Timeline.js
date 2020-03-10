const mongoose = require( 'mongoose');

const Timeline = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    item: {
      type: Number,
      required: true,
      default: false,
    },
    activity: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Timeline', Timeline);
