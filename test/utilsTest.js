'use strict';
var expect = require('chai').expect;
var utils = require('./../utils');

describe('fdpnUtils', function() {
  describe('contains', function() {
    it('should return true if a collection contains a value and false if it doesn\'t', function(done) {

      expect(utils.contains([1,2,3], 1)).to.equal(true);
      expect(utils.contains([1,2,3], '1')).to.equal(true);
      expect(utils.contains([1,2,3], 5)).to.equal(false);
      expect(utils.contains([1,2,3], '5')).to.equal(false);

      done();
    });
  });

  describe('isValidPhoneNumber', function() {
    it('should tell use if a phone number is valid based on our format', function(done) {

      expect(utils.isValidPhoneNumber('+971-00-000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('00971-00-000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('+971-0000000')).to.equal(true);

      expect(utils.isValidPhoneNumber('+971-00-000')).to.equal(false);
      expect(utils.isValidPhoneNumber('00971-00-000')).to.equal(false);
      expect(utils.isValidPhoneNumber('aaa')).to.equal(false);

      done();
    });
  });

  describe('isValidPhoneNumber', function() {
    it('should tell use if a phone number is valid based on our format', function(done) {

      expect(utils.isValidPhoneNumber('+971-00-000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('00971-00-000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('+971-0000000')).to.equal(true);
      expect(utils.isValidPhoneNumber('+97100000000')).to.equal(true);

      expect(utils.isValidPhoneNumber('+971-00-000')).to.equal(false);
      expect(utils.isValidPhoneNumber('+9710000000')).to.equal(false);
      expect(utils.isValidPhoneNumber('00971-00-000')).to.equal(false);
      expect(utils.isValidPhoneNumber('aaa')).to.equal(false);

      done();
    });
  });

  describe('parsePhone', function() {
    it('should tell use if a phone number is valid based on our format', function(done) {

      expect(utils.parsePhone('+971-52-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "52",
          "countryCode": "971",
          "number": "000000"
        },
        "fkCountry": "AE"
      });

      expect(utils.parsePhone('+966-00-000000', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "00",
          "countryCode": "966",
          "number": "000000"
        },
        "fkCountry": "SA"
      });

      expect(utils.parsePhone('+not-00-valid', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      });

      expect(utils.parsePhone('', phoneSettings)).to.deep.equal({
        "cellTokens": {
          "carrierCode": "",
          "countryCode": "",
          "number": ""
        },
        "fkCountry": ""
      });

      done();
    });
  });

  describe('validateCountryCode', function() {
    it('should return true or false if the countryCode is valid', function(done) {

      expect(utils.validateCountryCode('', phoneSettings)).to.equal({
        empty: true,
        invaid: true
      });

      done();
    });
  });
});

var phoneSettings = {
  "ae": {
    "iso2Code":"AE",
    "phoneCodes": {
      "country":971,
      "carrierCodes":[50,52,54,55,56],
      "maxlength":7,
      "minlength":7
    }
  },
  "sa": {
    "iso2Code":"SA",
    "phoneCodes": {
      "country":966,
      "carrierCodes":[50,53,54,55,56,57,58,59],
      "maxlength":7,
      "minlength":7
    },
  }
};
