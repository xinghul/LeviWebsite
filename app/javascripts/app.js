(function () {
  "use strict";
  // Declare app level module which depends on filters, and services
    var myApp = angular.module('myApp', [
        "ngAnimate",
        "ngCookies",
        "ngResource",
        // 'ngSanitize',
        "http-auth-interceptor",
        "myApp.controllers",
        "myApp.filters",
        "myApp.services",
        "myApp.directives",
        "ui.router",
        "ui.bootstrap"
    ])
    .config(["$provide", "$stateProvider", "$urlRouterProvider", "$locationProvider", function ($provide, $stateProvider, $urlRouterProvider, $locationProvider){
        // $provide.decorator("$sniffer", ["$delegate", function ($delegate) {
        //     $delegate.history = false;
        //     return $delegate;
        // }]);
        // $locationProvider.html5Mode(true);
        // For any unmatched url, send to /route1
        $urlRouterProvider
            .when('/demo', '/demo/dbeacon')
            .when("/blog", "/blog/list")
            .otherwise("/blog");
        
        $stateProvider
            .state('about', {
                url: "/about",
                templateUrl: "about",
                controller: "AboutCtrl"
            })

            .state('blog', {
                url: "/blog",
                templateUrl: "blog",
                controller: "BlogCtrl"
            })
                .state("blog.list", {
                    url: "/list",
                    templateUrl: "blog/list",
                    controller: "BlogListCtrl"
                })
                .state('blog.article', {
                    url: "/article/:index",
                    templateUrl: "blog/article",
                    controller: "BlogArticleCtrl"
                })
                .state("blog.editor", {
                    url: "/editor",
                    templateUrl: "blog/editor",
                    controller: "BlogEditorCtrl"
                })
                  
            .state('demo', {
                url: "/demo",
                templateUrl: "demo"
            })
                .state('demo.dbeacon', {
                    url: "/dbeacon",
                    templateUrl: "demo/dbeacon",
                    controller: "dBeaconCtrl"
                })
                .state('demo.dbeacon-chord', {
                    url: "/dbeacon-chord",
                    templateUrl: "demo/dbeacon-chord",
                    controller: "dBeaconChordCtrl"
                })
                .state('demo.boxshadow', {
                    url: "/boxshadow",
                    templateUrl: "demo/boxshadow"
                });
    }])
    .run(function ($rootScope, $state, $location, $timeout, Auth) {

        //watching the value of the currentUser variable.
        $rootScope.$watch('currentUser', function (currentUser) {
            // if no currentUser and on a page that requires authorization then try to update it
            // will trigger 401s if user does not have a valid session
            if (!currentUser && (['/blog/editor'].indexOf($location.path()) !== -1 )) {
                Auth.currentUser();
            }
        });

        // On catching 401 errors, redirect to the login page.
        $rootScope.$on('event:auth-loginRequired', function () {
            $("#modalAuth").modal("show");
            $("#mainContent").hide(500);
        });
        $rootScope.$on('event:auth-loginConfirmed', function () {
            $("#modalAuth").modal("hide");
            if ($("#mainContent").css("display") === "none")
                $("#mainContent").show(500);
        });
        $rootScope.$on("event:auth-loginCancelled", function () {
            if ($("#mainContent").css("display") === "none") {
                $("#mainContent").show(500);
                return $timeout(function () {
                    $state.go('blog', {}, { reload: true });
                }, 0);
            }
        });
    });
}());


