(function () {
  "use strict";
  angular.module('SolidWasteApp')
    .directive('viewDetail', function () {
      return {
        restrict: 'E',
        scope: {
          td: '@'
        },
        templateUrl: 'viewDetail.directive.tmpl.html',
        controller: 'DetailController as detail'
      }
    })
    .controller('DetailController', ['appData', DetailController]);

  function DetailController(appData) {
    var detail = this;
    detail.test = 'hi';

  }


})();