var app = angular.module('juju', [
  'ui.router',
  'facebook',
  'authFactory',
  'displayItemsController',
  'itemFactory',
  'juju.item',
  'juju.user',
  'userFactory',
  'chart.js',
  'ui.bootstrap'
]);

app.config(function ($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/landing');

  $stateProvider
  .state('items', {
    url: '/yourItems',
    views: {
      'body' : {
        templateUrl:'./items/views/item.html',
        controller: 'displayItemsCtrl'
      },
      'header' : {
        templateUrl: './layout/header.html'
      }
    },
    authenticate: true
  })
  .state('additems', {
    url: '/additems',
    views : {
      'body' : {
        templateUrl:'./items/views/additem.html'
      },
      'header' : {
        templateUrl: './layout/header.html'
      }
    },
    controller: 'itemsCtrl',
    authenticate: true
  })
  .state('landing', {
    url: '/landing',
    views: {
      'header' : {
        templateUrl: './layout/header.html'
      },
      'body' : {
        templateUrl:'./layout/landing.html'
      }
    },
    controller: 'fbAuthCtrl'
  })
  .state('usersettings',{
    url: '/users',
    views: {
      'header': {
        templateUrl: './layout/header.html',
        controller: 'usersCtrl'
      },
      'body' : {
        templateUrl: './users/views/usersettings.html'
      }
    },
    authenticate: true
  });
})
.run(function($rootScope, $state, Auth){
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams){
    //console.log(Auth.isloggedIn());
    if(!Auth.isloggedIn()  && toState.authenticate){
      event.preventDefault();
      $state.go('login');
    }
  });
});
