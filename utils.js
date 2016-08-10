'use strict';

var _ = _ || (typeof require === 'function' && require('lodash'));

/**
 * Uses abstract comparison (==) NOT strict comparison (===)
 */
function contains(list, item) {
  return _(list).map(_.toString).includes(_.toString(item));
};

var emptyPhoneObject = {
  fkCountry: '',
  cellTokens: {
    countryCode: '',
    carrierCode: '',
    number: ''
  }
};

/**
 * @see https://www.debuggex.com/r/tcX_Ez3vptR8n0Ff
 */
var phoneRegex = /^[00|\+]+([0-9]{2,3})(\-([0-9]{1,2}))?[\-]?([0-9]{6,8})$/;

var fdpnUtils = {
  contains: contains,

  isValidPhoneNumber: function(value) {
    return phoneRegex.test(value);
  },

  /**
   * phone format: +<country_code>-<carrier>-<number>
   */
  parsePhone: function(phone, phoneSettings) {
    if (!phone || !phoneRegex.test(phone)) {
      return emptyPhoneObject;
    }

    var matches = phone.match(phoneRegex);
    var countryCode = matches[1];
    var phoneCountryConfig = _.find(phoneSettings, function(setting) {
      return setting.phoneCodes.country == countryCode;
    });

    if (!phoneCountryConfig) {
      return emptyPhoneObject;
    }

    var carrierCode = matches[3] || '';
    var number = matches[4];

    return {
      fkCountry: phoneCountryConfig.iso2Code,
      cellTokens: {
        countryCode: countryCode,
        carrierCode: carrierCode,
        number: number
      }
    };
  },

  validateCountry: function(countryId, phoneSettings) {
    if (!countryId) {
      return {empty: true, invalid: true};
    }

    return {
      empty: false,
      invalid: (!phoneSettings[countryId.toLowerCase()] || !phoneSettings[countryId.toLowerCase()].phoneCodes)
    };
  },

  validateCarrierCode: function(carrierCode, countryId, phoneSettings) {
    if (!countryId) {
      return {
        invalid: true
      };
    }

    if (!phoneSettings[countryId.toLowerCase()]) {
      return {
        invalid: true
      };
    }

    var phoneCodes = phoneSettings[countryId.toLowerCase()].phoneCodes;

    if (phoneCodes === undefined) {
      return {empty: false, invalid: true};
    }

    if (!carrierCode) {
      return {
        empty: true,
        invalid: !(phoneCodes.carrierCodes === false)
      };
    }

    return {
      empty: false,
      invalid: !contains(phoneCodes.carrierCodes, carrierCode)
    };
  },

  validateNumber: function(number, min, max) {
    if (!number) {
      return {
        empty: true,
        invalid: true,
      };
    }

    if (!/[\d]+/g.test(number)) {
      return {
        empty: false,
        invalid: true,
        notNumeric: true
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
      minlengthInvalid: false,
      notNumeric: false
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

