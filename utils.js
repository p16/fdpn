'use strict';

var utils = {
  isValidPhoneNumber: function(value) {
    return /^(00|\+)[0-9]{2,3}[\-\s0-9]{9,13}$/.test(value);
  }
}

if (typeof require === 'function') {
  module.exports = utils;
}
