module.exports = {
  ifeq(a, b, options) {
    if (
      typeof a === 'undefined' ||
      typeof b === 'undefined'
    ) {
      return options.inverse(this);
    }
    if (a.toString() === b.toString()) {
      return options.fn(this);
    }

    return options.inverse(this);
  }
}