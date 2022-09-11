const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        qty: {
          type: Number,
          required: true,
          default: 1
        },
        bookId: {
          type: Schema.Types.ObjectId,
          ref: 'Book',
          required: true,
        }
      }
    ]
  }
});

module.exports = model('User', userSchema);