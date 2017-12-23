/* Alya Smart Mirror
 * Date time controller
 *
 * By Bilal Al-Saeedi
 * MIT Licensed.
 */
(function(angular) {
  'use strict';

  angular.module('alya-smart-mirror')
    .controller('DateTimeCtrl', function(DateTimeService, $interval, $scope) {
      $interval(function() {
        $scope.date = DateTimeService.updateTime();
      }, 1000);
    });

}(window.angular));

