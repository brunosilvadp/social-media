const mongoose = require('mongoose');

const Comment = new mongoose.Schema(
  {
    user: {
      type: Number,
      required: true,
    },
    post: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', Comment);
