/**
 * Copyright reelyActive 2017-2018
 * We believe in an open Internet of Things.
 */


INVALID_RSSI = -128;


angular.module('norble-interaction-demo', [ 'ui.bootstrap' ])

  // Interaction controller
  .controller('InteractionCtrl', function($scope, $location) {
    var url = $location.protocol() + '://' + $location.host() + ':' +
              $location.port();
    var socket = io.connect(url);
    var previousInstanceId;
    var previousRssi = INVALID_RSSI;
    var previousCyclicCount = -1;
    var isHistoricData = false;
    $scope.appliedFilters = [];

    applyConstantsToScope();

    socket.on('norble', function(data) {
      $scope.norble = data.norble;
      if(isNewSurvey(data.norble)) {
        updateInteraction(data.norble);
        updateAcceleration(data.norble);
        $scope.$apply();
      }
    });

    function isNewSurvey(norble) {
      if(norble.cyclicCount !== previousCyclicCount) {
        previousCyclicCount = norble.cyclicCount;
        return true;
      }
      return false;
    }

    function updateInteraction(norble) {
      var slot = 0;

      // NorBLE has detected at least one beacon
      if(norble.nearest.length > 0) {
        var closestInstanceId = norble.nearest[0].instanceId;
        var closestRssi = norble.nearest[0].rssi;
        var isPreviousStronger = ((previousRssi > closestRssi) &&
                                  (previousInstanceId !== closestInstanceId));

        if(!isHistoricData && isPreviousStronger) {
          slot = getSlot(previousInstanceId);
          isHistoricData = true;
        }
        else {
          slot = getSlot(closestInstanceId);
          isHistoricData = false;
        }

        previousInstanceId = closestInstanceId;
        previousRssi = closestRssi;
      }

      // NorBLE has not detected any beacons, but there was one previously
      else if(previousInstanceId !== null) {
        if(isHistoricData) {
          isHistoricData = false;
        }
        else {
          slot = getSlot(previousInstanceId);
          isHistoricData = true;
        }

        previousInstanceId = null;
        previousRssi = INVALID_RSSI;
      }

      $scope.atFirst = (slot === 1);
      $scope.atSecond = (slot === 2);
      $scope.atThird = (slot === 3);
      if(isHistoricData) {
        $scope.appliedFilters = [ 'Previous survey memory' ];
      }
      else {
        $scope.appliedFilters = [];
      }
    }

    function getSlot(instanceId) {
      if(instanceId === $scope.firstInstanceId) {
        return 1;
      }
      else if(instanceId === $scope.secondInstanceId) {
        return 2;
      }
      else if(instanceId === $scope.thirdInstanceId) {
        return 3;
      }
      return 0;
    }

    function updateAcceleration(norble) {
      if(norble.accelerationX === 'n/a') {
        $scope.hasAcceleration = false;
      }
      else {
        $scope.hasAcceleration = true;
      }
    }

    function applyConstantsToScope() {
      $scope.norbleImageUrl = NORBLE_IMAGE_URL;

      $scope.firstImageUrl = FIRST_IMAGE_URL;
      $scope.secondImageUrl = SECOND_IMAGE_URL;
      $scope.thirdImageUrl = THIRD_IMAGE_URL;

      $scope.firstInstanceId = FIRST_INSTANCE_ID.substr(-8);
      $scope.secondInstanceId = SECOND_INSTANCE_ID.substr(-8);
      $scope.thirdInstanceId = THIRD_INSTANCE_ID.substr(-8);

      $scope.firstImageCaption = FIRST_IMAGE_CAPTION;
      $scope.secondImageCaption = SECOND_IMAGE_CAPTION;
      $scope.thirdImageCaption = THIRD_IMAGE_CAPTION;
    }

  });
