const mongoose = require( 'mongoose');

const Follower = new mongoose.Schema(
  {
    user_following: {
      type: Number,
      required: true,
    },
    user_followed: {
      type: Number,
      required: true,
    },
    following: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Follower', Follower);
