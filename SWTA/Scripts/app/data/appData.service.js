(function () {
  "use strict";

  angular.module('SolidWasteApp')
.factory('appData', ['$http', appData]);

  function appData($http) {
    return {
      getAssessments: getAssessments,
      getLog: getLog,
      saveTaxData: saveTaxData
    };

    function saveTaxData(pa) {
      return $http.post('API/Assessments/', pa)
        .then(function (response) {
          console.log('data save success');
          return response;
        }, function (response) {
          console.log('error saving data');
          return response;
        });        
    }

    function getAssessments(owner, road, parcel, district,
        usedesc, buildings, collected, assessed, notes,
        alreadyworked, querytype) {

      console.log('district', district, 'buildings', buildings, 'collected', collected);

      var s = '';
      s = fix(s, owner, 'owner');
      s = fix(s, road, 'road');
      s = fix(s, parcel, 'parcel');
      s = fix(s, district.toString(), 'district');
      s = fix(s, usedesc, 'usedesc');
      s = fix(s, buildings.toString(), 'buildings');
      s = fix(s, collected.toString(), 'collected');
      s = fix(s, assessed.toString(), 'assessed');
      s = fix(s, notes, 'notes');
      s = fix(s, querytype.toString(), 'querytype');
      s = fix(s, alreadyworked, 'alreadyworked');
      console.log('s', s);
      return $http.get('API/Assessments/' + s, { cache: false })
      .then(function (response) {
        return response;
      }, function (response) {
        console.log('get assessments data error', response);
        return response;
      });
    }

    function getLog(p) {
      console.log('getLog PID', p);
      return $http.get('API/Log/' + p, { cache: false })
        .then(function (response) {
          return response;
        }, function (response) {
          console.log('get log error', response);
        return response;
        });
    }

    function fix(s, v, n) {
      if (v !== null && v.length > 0) {
        if (s.length == 0) {
          s = s + '?';
        } else {
          s = s + '&';
        }
        s = s + n + '=' + v;
      }
      return s;
    }

  }

})();