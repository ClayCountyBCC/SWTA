(function () {
  "use strict";

  angular.module('SolidWasteApp')
    .controller('DialogController', ['$scope',
      'ad', 'index', 'assessmentData', dialogController]);

  function dialogController($scope, ad, index, assessmentData) {
    $scope.ad = ad;
    $scope.data = assessmentData;
    $scope.index = index;
  }

})();