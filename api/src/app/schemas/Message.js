const mongoose = require( 'mongoose');

const Message = new mongoose.Schema(
  {
    user_send: {
      type: Number,
      required: true,
    },
    user_destinatary: {
      type: Number,
      required: true,
    },
    message: {
      type: Array,
      required: true,
    },
    checked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', Message);
