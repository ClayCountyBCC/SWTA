(function ()
{
  "use strict";

  angular.module('SolidWasteApp')
    .controller('MainController', ['appData', '$mdSidenav', '$mdDialog', mainController]);

  function mainController(appData, $mdSidenav, $mdDialog)
  {
    var main = this;
    main.topIndex = 0;
    main.totalRecords = 0;
    main.showProgress = false;
    main.assessmentData = [];

    main.showSearch = true;

    main.resetSearch = function ()
    {
      main.currentFilter = '';
      main.queryType = 0;
      main.filterOwner = '';
      main.filterRoad = '';
      main.filterParcel = '';
      main.filterDistrict = '';
      main.filterUseDesc = '';
      main.filterBuildings = '';
      main.filterCollected = '';
      main.filterAssessed = '';
      main.filterNotes = '';
      main.filterAlreadyWorked = true;
    };

    main.resetSearch();

    main.showFilters = function ()
    {
      $mdSidenav('filterRight').toggle();
    };

    main.showReports = function ()
    {
      $mdSidenav('reportRight').toggle();
    };

    main.toggleSearch = function ()
    {
      main.showSearch = !main.showSearch;
    };


    main.filterQuery = function (filterType, queryType)
    {
      main.queryType = queryType;
      main.currentFilter = filterType;
      main.updateData();
      $mdSidenav('filterRight').toggle();
    };

    main.updateData = function ()
    {

      main.showProgress = true;

      appData.getAssessments(main.filterOwner,
        main.filterRoad,
        main.filterParcel,
        main.filterDistrict === null ? '' : main.filterDistrict,
        main.filterUseDesc,
        main.filterBuildings === null ? '' : main.filterBuildings,
        main.filterCollected === null ? '' : main.filterCollected,
        main.filterAssessed === null ? '' : main.filterAssessed,
        main.filterNotes,
        main.filterAlreadyWorked.toString(),
        main.queryType === 0 ? '' : main.queryType)
        .then(function (response)
        {
          if (response.status !== 500)
          {
            main.assessmentData = response.data;
            console.log('assessment data', response.data);
          }

          main.showProgress = false;
        });

    };

    main.showDetail = function (ev, ad, i)
    {
      //ad.showDetail = !ad.showDetail;
      console.log('index', i);
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: 'Scripts/app/dialog/dialog.controller.tmpl.html',
        parent: angular.element(document.body),
        locals: {
          ad: ad,
          index: i,
          assessmentData: main.assessmentData
        },
        targetEvent: ev,
        clickOutsideToClose: true,
        fullscreen: false
      })
        .then(function ()
        {
          main.updateData();
        }, function ()
        {
          main.updateData();
        });
    };



  }

})();