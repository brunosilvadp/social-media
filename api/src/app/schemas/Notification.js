const mongoose = require('mongoose');

const Notification = new mongoose.Schema(
  {
    notification: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    //Column - USER: Store the id of destinatary user if the type column equals message else store user id
    user: {
      type: Number,
      required: true,
    },
    content_id: {
      type: Number,
      required: true,
    },
    checked: {
        type: Boolean,
        required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', Notification);
