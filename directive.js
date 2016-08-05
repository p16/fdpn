'use strict';

angular
  .module('fdpn.nmPhoneNumber', [])
  .directive('nmPhoneNumberSingleInput', function () {
     return {
        require: 'ngModel',
        link: function($scope, elem, attr, ngModel) {
          ngModel.$parsers.unshift(function(value) {
            var isValid = utils.isValidPhoneNumber(value);
            ngModel.$setValidity('nmPhoneNumberSingleInput', isValid);
            return isValid ? isValid : undefined;
          });

          ngModel.$formatters.unshift(function(value) {
            ngModel.$setValidity('nmPhoneNumberSingleInput', utils.isValidPhoneNumber(value));
            return value;
          });
        }
     }
  })
  .directive('nmPhoneNumber', function () {
    return {
      scope: {
        phoneNumber: '=phoneNumber',
        phoneSettings: '=phoneSettings',
        loadingsSave: '=loadingsSave',
        save: '&'
      },
      controller: function ($scope) {
        $scope.phoneData = parsePhone($scope.phoneNumber, $scope.phoneSettings);
        $scope.getProperty = function (property){
          if($scope.phoneData.fkCountry){
            var phoneSettings = $scope.phoneSettings[$scope.phoneData.fkCountry.toLowerCase()].phoneCodes;
            return phoneSettings[property];
          }
        };

        $scope.changeCarrierCode = function() {
          var cellTokens = $scope.phoneData.cellTokens;
          var fkCountry  = $scope.phoneData.fkCountry.toLowerCase();
          var phoneCodes = $scope.phoneSettings[fkCountry].phoneCodes;

          cellTokens.countryCode = phoneCodes.country;
          cellTokens.carrierCode = phoneCodes.carrierCodes[0] ? phoneCodes.carrierCodes[0].toString() : null;
        };

        $scope.savePhone = function (phoneData) {
          $scope.save()(phoneData);
        };
      },
      templateUrl: function(elem, attr){
        return attr.templateUrl;
      }
    };
  });

/**
 * phone format: +<country_code>-<carrier>-<number>
 */
function parsePhone(phone, phoneSettings) {
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
  var phoneCountryConfig = _.find(phoneSettings, function(setting) {
    return setting.phoneCodes.country == countryCode;
  });

  return {
    fkCountry: phoneCountryConfig.iso2Code,
    cellTokens: {
      countryCode: countryCode,
      carrierCode: carrierCode,
      number: number
    }
  };
}
