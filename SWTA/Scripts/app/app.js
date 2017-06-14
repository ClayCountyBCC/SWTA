(function () {
  "use strict";

  angular.module('SolidWasteApp', ['ngMaterial'])
    .config(function ($mdThemingProvider) {
      $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('green');
    });

})();