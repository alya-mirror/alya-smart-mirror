/* Alya Smart Mirror
 * Main app
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */
(function(angular) {
  'use strict';

  const path = require('path');
  const helper = require(path.resolve('utils/helper.js'));
  const config = helper.getDefaultConfigs();

  // Error logging
  window.onerror = function(errorMsg, url, lineNumber) {
    fs.appendFileSync('./alya-smart-mirror.log', '[' + new Date().toString() + '] '
      + errorMsg + '| Script: ' + url + ' Line: ' + lineNumber + '\n');
  };
  const language = (typeof config.general.language !== 'undefined') ? config.general.language.substring(0, 2)
    .toLowerCase() : 'en';

  angular.module('alya-smart-mirror', ['ngAnimate', 'tmh.dynamicLocale', 'pascalprecht.translate'])
    .config(function(tmhDynamicLocaleProvider) {
      console.log(config);
      tmhDynamicLocaleProvider.localeLocationPattern(`bower_components/angular-i18n/angular-locale_${language}.js`);
    })
    .config(['$translateProvider', function($translateProvider) {
      $translateProvider
        .uniformLanguageTag('bcp47')
        .useStaticFilesLoader({
          prefix: 'app/locales/',
          suffix: '.json'
        });
      $translateProvider.useSanitizeValueStrategy(null);
      $translateProvider.preferredLanguage(language);
    }]);

}(window.angular));
