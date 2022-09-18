const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  avatarUrl: String,
  resetToken: String,
  resetTokenExp: Date,
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

userSchema.methods.addToCart = function (course) {
  const items = [...this.cart.items];
  const index = items.findIndex(el => el.bookId.toString() === course._id.toString());

  if (index === -1) {
    items.push({
      qty: 1,
      bookId: course._id
    })
  } else {
    items[index].qty++;
  }

  this.cart = { items };

  return this.save();
}

userSchema.methods.removeFromCart = function (id) {
  let items = [...this.cart.items];
  const index = items.findIndex(el => el.bookId.toString() === id.toString());

  if (index === -1) {
    return null;
  }

  if (items[index].qty > 1) {
    items[index].qty--;
  } else {
    delete items[index];
    items = items.filter(el => el.bookId.toString() !== id.toString());
  }

  this.cart = { items };

  return this.save();
}


userSchema.methods.clearCart = function () {
  this.cart.items = [];

  return this.save();
}


module.exports = model('User', userSchema);