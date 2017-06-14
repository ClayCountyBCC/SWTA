(function () {
  "use strict";

  var detailComp = {
    bindings: {
      td: '<',
      i: '<',
      d: '<'
    }, 
    controller: 'DetailController as detail',
    templateUrl: 'Scripts/app/detail/viewDetail.component.tmpl.html'
  }

  angular.module('SolidWasteApp')
    .component('viewDetail', detailComp)
    .controller('DetailController', ['appData', '$timeout', DetailController]);
   

  function DetailController(appData, $timeout) {
    var detail = this;
    detail.notes = [];
    detail.errorMessage = '';
    detail.noteToSave = '';
    detail.saving = false;
    detail.currentYear = new Date().getFullYear().toString();
    console.log('currentYear', detail.currentYear);
    console.log('detail.data', detail.d);
    console.log('detail index', detail.i);

    detail.viewPrev = function () {
      detail.i--;
      if (detail.i < 0) detail.i = 0;
      detail.td = detail.d[detail.i];
    };

    detail.viewNext = function () {
      detail.i++;
      if (detail.d.length - 1 < detail.i) detail.i = detail.d.length - 1;
      detail.td = detail.d[detail.i];
    };

    function updateLogs() {
      appData.getLog(detail.td.PID)
        .then(function (response) {
          if (response.status !== 500) {
            detail.notes = response.data;
            console.log('notes for ' + detail.td.PID, response.data);
          }

        });
    }

    updateLogs();

    detail.saveData = function (pa, c, a, note) {
      detail.noteToSave = detail.noteToSave.trim();
      note = note.trim();
      if (detail.noteToSave.length === 0 && note.length === 0){
        showMessage('You must enter a note in order to save.');
        return;
      }
      else {      
        if (detail.noteToSave.length > 0 && note.length > 0) {
          detail.noteToSave = ' - ' + detail.noteToSave;
        }      
        pa.Notes = note + detail.noteToSave;
        pa.Collected_Units = c;
        pa.Assessed_Units = a;
        detail.saving = true;
        appData.saveTaxData(pa)
        .then(function (response) {
          if (response.status !== 500) {
            updateLogs();
          }
          detail.saving = false;
        });
      }
    };

    function showMessage(message) {
      detail.errorMessage = message;
      $timeout(function (t) {
        detail.errorMessage = '';
      }, 5000);
    }

  }


})();