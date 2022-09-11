const { Schema, model } = require('mongoose');

const userOrder = new Schema({
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  books: [
    {
      book: {
        type: Object,
        required: true
      },
      qty: {
        type: Number,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now()
  },
});

module.exports = model('Order', userOrder);