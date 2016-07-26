'use strict';

angular.module('fdpn.nmPhoneNumber', []).directive('nmPhoneNumber', function () {
  return {
    scope: {
      phoneNumber: '=phoneNumber',
      phoneSettings: '=phoneSettings',
      loadingsSave: '=loadingsSave',
      customTranslations: '=?',
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

      $scope.translations = _.merge(
        {
          countryLabel: 'Country',
          countryRequired: 'This value is required',
          phoneLabel: 'Phone number',
          phoneRequired: 'Phone cannot be blank',
          phoneCarrierRequired: 'Area code cannot be blank',
          phoneNumberRequired: 'Phone cannot be blank',
          saveLabel: 'Save',
        },
        $scope.customTranslations
      );
    },
    template: "<form name=\"phoneNumberForm\" novalidate=\"novalidate\" data-ng-submit=\"phoneNumberForm.$valid && savePhone(phoneData)\" data-ng-class=\"{true: 'submitted'}[submitted]\" class=\"standard\"><div class=\"field_section select_container\"><label class=\"control-label\">{{ 'fkCountry'|fnpnTraslate }}*</label>    <div class=\"controls\">      <select data-ng-model=\"phoneData.fkCountry\" data-ng-options=\"setting.iso2Code as setting.name for (country, setting) in phoneSettings\" data-ng-change=\"changeCarrierCode()\"></select>    </div>    <p data-ng-show=\"(submitted || phoneNumberForm.fkCountry.$dirty) && phoneNumberForm.fkCountry.$invalid\" class=\"form_error\">{{ translations.countryRequired }}</p>  </div>  <div class=\"field_section\">    <label class=\"control-label\">{{ translations.phoneLabel }}</label>    <input id=\"data-cellPhoneCode\" type=\"text\" readonly=\"readonly\" name=\"cellPhoneCountryCode\" data-ng-blur=\"\" data-ng-model=\"phoneData.cellTokens.countryCode\" class=\"formElement inline small\"/>    <select id=\"data-cellPhonePrefix\" name=\"cellPhonePrefix\" data-ng-blur=\"\" data-ng-if=\"getProperty('carrierCodes')\" ng-model=\"phoneData.cellTokens.carrierCode\" required=\"required\" class=\"formElement inline small\">      <option ng-repeat=\"prefix in getProperty('carrierCodes')\" ng-selected=\"{{prefix == phoneData.cellTokens.carrierCode}}\" value=\"{{prefix.toString()}}\" data-ng-bind=\"prefix.toString()\"></option>    </select>    <div class=\"auto_width\">      <input id=\"data-cellPhone\" type=\"text\" name=\"cellPhone\" minlength=\"{{getProperty('minlength')}}\" maxlength=\"{{getProperty('maxlength')}}\" data-ng-blur=\"\" data-ng-model=\"phoneData.cellTokens.number\" data-ng-trim=\"true\" data-allow-only-numbers=\"data-allow-only-numbers\" required=\"required\" class=\"formElement inline\"/>    </div>    <div data-ng-show=\"submitted || phoneNumberForm.cellPhone.$dirty\" class=\"form_error\">      <p data-ng-show=\"phoneNumberForm.cellPhone.$error.required\">{{ translations.phoneRequired }}</p>      <p data-ng-show=\"phoneNumberForm.cellPhone.$error.minlength\" data-translate=\"cellPhoneMinLength\" data-translate-value-min=\"{{getProperty('minlength')}}\"></p>      <p data-ng-show=\"phoneNumberForm.cellPhone.$error.maxlength\" data-translate=\"cellPhoneMaxLength\" data-translate-value-max=\"{{getProperty('maxlength') + 1}}\"></p>    </div>    <p data-ng-show=\"(submitted || phoneNumberForm.cellPhonePrefix.$dirty) && phoneNumberForm.cellPhonePrefix.$error.required\" class=\"form_error\">{{ translations.phoneCarrierRequired }}</p>    <p data-ng-show=\"(submitted || phoneNumberForm.cellPhone.$dirty) && phoneNumberForm.cellPhone.$error.required\" class=\"form_error\">{{ translations.phoneNumberRequired }}</p>  </div>  <div class=\"field_section button_container\">    <button type=\"submit\" data-ng-class=\"{'disabled': phoneNumberForm.$invalid}\" data-ng-click=\"submitted = true\" data-ng-disabled=\"loadingsSave\" class=\"block_button\"> {{ translations.saveLabel }}<i data-ng-show=\"loadingsSave\" data-translate=\"loading\" class=\"loader\"></i></button>  </div></form>"
  };
}).filter('fnpnTraslate', function(translateFilter) {
  if (translateFilter) {
    return translateFilter;
  }

  return function(value) {
    return value;
  }
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
