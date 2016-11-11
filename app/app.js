/* 
 LIRC Web Admin - a web admin for LIRC administration 

 You may use any Web Server Admin project under the terms
 of the GNU General Public License (GPL) Version 3.

 (c) 2016 Emilio Mariscal (emi420 [at] gmail.com)
 
 */

 angular.module('Admin', [
        'app.controllers',
        'app.services',
        'ngRoute',
        'ui-iconpicker'
    ])
    .config(['$routeProvider',
     function($routeProvider) {
        $routeProvider.
           when('/debug', {
              templateUrl: 'templates/debug.html',
              controller: 'DebugCtrl'
           }).
           when('/wizard', {
              templateUrl: 'templates/wizard.html',
              controller: 'WizardCtrl'
           }).
           when('/wizard2', {
              templateUrl: 'templates/wizard2.html',
              controller: 'Wizard2Ctrl'
           }).
           when('/admin/:controltype', {
              templateUrl: 'templates/admin.html',
              controller: 'AdminCtrl'
           }).
           when('/remotes', {
              templateUrl: 'templates/remotes.html',
              controller: 'RemotesCtrl'
           }).
           otherwise({
              redirectTo: '/remotes'
           });
     }])

