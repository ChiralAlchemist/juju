angular.module('displayItemsController', [])
.controller('displayItemsCtrl', function ($scope, displayItemsFactory, Auth, $uibModal){
  //console.log('userId from displayItemsCtrl', Auth.userId);
  var user;
  Auth.isloggedIn()
  .then( function successCallback (userId) {
    $scope.user = userId;
    return displayItemsFactory.getItemData(userId)
  }, function errorCallback (err) {
  })
  .then(
    function successCallback(response) {
      console.log(response);
      $scope.itemData = response.data;
    }, function errorCallback(err) {
      console.log(err);
      $scope.err = 'There was a problem loading your data';
    })
  .then(
    function successCallback(response) {
      console.log($scope.user)
      return displayItemsFactory.getItemHistoryData($scope.user)
    })
  .then(
    function successCallback(response) {
      console.log(response.data)
      $scope.itemHistoryData = displayItemsFactory.organizeData(response.data);
    });

  $scope.update = function (itemId , itemObj) {
    displayItemsFactory.updateData(itemId, itemObj);
  };  
    
  $scope.deleteWatched = function(itemId){
    
    displayItemsFactory.deleteData(itemId);
  };

  console.log('userId' , $scope.user)
  $scope.itemHistory = function () {
      displayItemsFactory.getItemHistoryData($scope.user)
    .then( function successCallback (data) {
      $scope.ItemHistoryData = data;
    })
  }
  $scope.ok = function () {
    $uibModalInstance.close('hello');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $scope.open = function (nikename) {
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'myModalContent.html',
      backdrop : false,//'/scripts/angular-ui-bootstrap/template/modal/backdrop.html',
      controller: 'ModalInstanceCtrl',
      //size: size,
      windowTemplateUrl : '/scripts/angular-ui-bootstrap/template/modal/window.html',
    //  scope: $scope.item = size ,
      resolve: {
        simpleObj : {value: nikename , itemHistory: $scope.itemHistoryData }
      }
    });
  };

})
.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, Auth , displayItemsFactory , simpleObj) {
  console.log(simpleObj.value)
  $scope.itemid = simpleObj.value;
  $scope.itemHistoryData = simpleObj.itemHistory;
  $scope.lackofData = false;
  $scope.errMessage = false;

  if($scope.itemHistoryData[$scope.itemid].priceGraph[0][0].length<4){
    console.log($scope.itemHistoryData[$scope.itemid].priceGraph[0][0].length)
    $scope.lackofData = true;
    $scope.errMessage = true;
  }
  
  $scope.ok = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
