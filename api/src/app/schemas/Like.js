const mongoose = require( 'mongoose');

const Like = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true,
    },
    post: {
      type: Number,
      required: true,
    },
    liked: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Like', Like);
