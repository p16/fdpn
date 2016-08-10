'use strict';

angular
  .module('fdpn.nmPhoneNumber', [])
  .directive('nmPhoneNumberSingleInput', function () {
     return {
        require: 'ngModel',
        link: function($scope, elem, attr, ngModel) {
          ngModel.$parsers.unshift(function(value) {
            var isValid = fdpnUtils.isValidPhoneNumber(value);
            ngModel.$setValidity('nmPhoneNumberSingleInput', isValid);
            return isValid ? isValid : undefined;
          });

          ngModel.$formatters.unshift(function(value) {
            ngModel.$setValidity('nmPhoneNumberSingleInput', fdpnUtils.isValidPhoneNumber(value));
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
        options: '=options',
        save: '&'
      },
      controller: function ($scope) {
        function getProperty(property) {
          if($scope.phoneData.fkCountry){
            var phoneSettings = $scope.phoneSettings[$scope.phoneData.fkCountry.toLowerCase()].phoneCodes;
            return phoneSettings[property];
          }
        };

        function resetValidation() {
          $scope.phoneValidation = {
            countryCode: {},
            carrierCode: {},
            number: {}
          };
        }

        resetValidation();
        $scope.phoneData = fdpnUtils.parsePhone($scope.phoneNumber, $scope.phoneSettings);
        $scope.getProperty = getProperty;

        $scope.changeCarrierCode = function() {
          resetValidation();
          $scope.validateCountry();

          if (!$scope.isPhoneValid()) {
            return;
          }

          var cellTokens = $scope.phoneData.cellTokens;
          var fkCountry  = $scope.phoneData.fkCountry.toLowerCase();
          var phoneCodes = $scope.phoneSettings[fkCountry].phoneCodes;

          cellTokens.countryCode = phoneCodes.country;
          cellTokens.carrierCode = phoneCodes.carrierCodes[0] ? phoneCodes.carrierCodes[0].toString() : null;

          $scope.validateCarrierCode();
          $scope.validateNumber({trimNumber: false});
        };

        $scope.savePhone = function (phoneData) {
          $scope.save()(phoneData);
        };

        $scope.validateCountry = function() {
          $scope.phoneValidation.countryCode = fdpnUtils.validateCountry(
            $scope.phoneData.fkCountry,
            $scope.phoneSettings
          );
        }

        $scope.validateCarrierCode = function() {
          $scope.phoneValidation.carrierCode = fdpnUtils.validateCarrierCode(
            $scope.phoneData.cellTokens.carrierCode,
            $scope.phoneData.fkCountry,
            $scope.phoneSettings
          );
        }

        $scope.validateNumber = function(options) {
          options = options || {};

          $scope.phoneData.cellTokens.number = fdpnUtils.extractNumbers($scope.phoneData.cellTokens.number);

          /* when changing country code we should not touch the number, but only run the validation*/
          if (options.trimNumber !== false) {
            $scope.phoneData.cellTokens.number = fdpnUtils.shortenToLengh(
              $scope.phoneData.cellTokens.number,
              getProperty('maxlength')
            );
          }

          $scope.phoneValidation.number = fdpnUtils.validateNumber(
            $scope.phoneData.cellTokens.number,
            getProperty('minlength'),
            getProperty('maxlength')
          );
        }

        $scope.isPhoneValid = function() {
          return (
            ($scope.phoneValidation.countryCode.invalid === undefined || $scope.phoneValidation.countryCode.invalid === false) &&
            ($scope.phoneValidation.carrierCode.invalid === undefined || $scope.phoneValidation.carrierCode.invalid === false) &&
            ($scope.phoneValidation.number.invalid === undefined || $scope.phoneValidation.number.invalid === false)
          );
        }
      },
      templateUrl: function(elem, attr){
        return attr.templateUrl;
      }
    };
  });
