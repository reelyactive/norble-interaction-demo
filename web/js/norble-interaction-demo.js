/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things.
 */

const KNOB_BASE_CLASSES = 'img-responsive center-block';

angular.module('norble-interaction-demo', [ 'ui.bootstrap' ])

  // Interaction controller
  .controller('InteractionCtrl', function($scope, $location) {
    var url = $location.protocol() + '://' + $location.host() + ':' +
              $location.port();
    var socket = io.connect(url);

    applyConstantsToScope();

    socket.on('norble', function(data) {
      $scope.norble = data.norble;
      updateInteraction(data.norble);
      updateAcceleration(data.norble);
      $scope.$apply();
    });

    function updateInteraction(norble) {
      var slot = 0;
      if(norble.nearest.length > 0) {
        var closestInstanceId = norble.nearest[0].instanceId;
        if(closestInstanceId === $scope.firstInstanceId) {
          slot = 1;
        }
        else if(closestInstanceId === $scope.secondInstanceId) {
          slot = 2;
        }
        else if(closestInstanceId === $scope.thirdInstanceId) {
          slot = 3;
        }
      }
      $scope.atFirst = (slot === 1);
      $scope.atSecond = (slot === 2);
      $scope.atThird = (slot === 3);
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
