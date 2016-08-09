'use strict';

/**
 * Uses abstract comparison (==) NOT strict comparison (===)
 */
function contains(list, item) {
  for(var i = 0; i < list.length; i++) {
    if (list[i] == item) {
      return true;
    }
  }

  return false;
};

function getphoneCountryConfig(phoneSettings, countryCode) {
  var found;
  var keys = Object.keys(phoneSettings);

  keys.forEach(function(key) {
    if (!found && phoneSettings[key].phoneCodes.country == countryCode) {
      found = phoneSettings[key];
    }
  });

  return found;
}

var fdpnUtils = {
  contains: contains,

  isValidPhoneNumber: function(value) {
    return /^(00|\+)[0-9]{2,3}[\-\s0-9]{9,13}$/.test(value);
  },

  /**
   * phone format: +<country_code>-<carrier>-<number>
   */
  parsePhone: function(phone, phoneSettings) {
    var regexpPhone = /^\+([0-9]{2,3})(\-([0-9]{1,2}))?\-([0-9]{6,8})$/;
    if (!phone || !regexpPhone.test(phone)) {
      return {
        fkCountry: '',
        cellTokens: {
          countryCode: '',
          carrierCode: '',
          number: ''
        }
      };
    }

    var mathes = phone.match(regexpPhone);
    var countryCode = mathes[1];
    var carrierCode = mathes[3] || '';
    var number = mathes[4];
    var phoneCountryConfig = getphoneCountryConfig(phoneSettings, countryCode);

    return {
      fkCountry: phoneCountryConfig.iso2Code,
      cellTokens: {
        countryCode: countryCode,
        carrierCode: carrierCode,
        number: number
      }
    };
  },

  validateCountryCode: function(countryCode, phoneSettings) {
    if (!countryCode) {
      return {empty: true, invalid: true};
    }

    return {
      empty: false,
      invalid: (!phoneSettings[countryCode.toLowerCase()] || !phoneSettings[countryCode.toLowerCase()].phoneCodes)
    };
  },

  validateCarrierCode: function(carrierCode, countryCode, phoneSettings) {
    if (!carrierCode) {
      return {empty: true, invalid: true};
    }

    var phoneCodes = phoneSettings[countryCode.toLowerCase()] && phoneSettings[countryCode.toLowerCase()].phoneCodes;

    return {
      empty: false,
      invalid: !contains(phoneCodes.carrierCodes, carrierCode)
    };
  },

  validateNumber: function(number, min, max) {
    if (!number || !/[\d]+/g.test(number)) {
      return {
        empty: true,
        invalid: true,
      };
    }

    if (number.length < min) {
      return {
        empty: false,
        invalid: true,
        minlengthInvalid: true
      };
    }

    if (number.length > max) {
      return {
        empty: false,
        invalid: true,
        maxlengthInvalid: true
      };
    }

    return {
      empty: false,
      invalid: false,
      maxlengthInvalid: false,
      minlengthInvalid: false
    };
  },

  extractNumbers: function (value) {
    return value.replace(/[^\d]+/g, '');
  },

  shortenToLengh: function (value, length) {
    return value.substring(0, length);
  }
}

if (typeof require === 'function') {
  module.exports = fdpnUtils;
}
