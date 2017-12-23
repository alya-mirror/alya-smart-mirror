/* Alya Smart Mirror
 * Date time service
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */
(function(angular) {
  'use strict';

  const path = require('path');
  const helper = require(path.resolve('utils/helper.js'));

  angular.module('alya-smart-mirror', [])
    .service('DateTimeService', function() {
      const service = {};
      const config = helper.getDefaultConfigs();

      moment.locale(config.general.language);

      //Update the time
      service.updateTime = function() {
        return new moment();
      };

      return service;
    });

}(window.angular));
