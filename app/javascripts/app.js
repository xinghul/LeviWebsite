(function () {
    "use strict";

    var eventAction = ["$rootScope", "$state", "$timeout", "Auth", function ($rootScope, $state, $timeout, Auth) {
        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            if (!$rootScope.preloadSuccess && toState.templateUrl !== "preload") {
                event.preventDefault();
                $rootScope.nextState = toState.name;
                $state.go("preload");
            }

            // if no currentUser and on a page that requires authorization then try to update it
            // will trigger 401s if user does not have a valid session
            if (toState.name === "blog.editor" && !$rootScope.currentUser) {
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
                    $state.go('blog.list', {}, { reload: true });
                }, 0);
            }
        });
    }];

    var whenConfig = ['$urlRouterProvider', function($urlRouterProvider) {
        $urlRouterProvider

            .when("/demo", ["$state", function ($state) {
                $state.go("demo.dbeacon");
                
            }])

            .when("/blog", ["$state", function ($state) {
                $state.go("blog.list");
                
            }])

            .otherwise("/blog/list");
    }];

    var stateConfig = ["$stateProvider", function($stateProvider) {

        $stateProvider

            .state("preload", {
                url: "/preload",
                templateUrl: "preload",
                controller: "PreloadCtrl"
            })

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
                });
    }];
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
    .config(whenConfig)
    .config(stateConfig)
    .run(eventAction)
    .run(["$rootScope", "$state", "$q", "$http", "$timeout", function ($rootScope, $state, $q, $http, $timeout) {
        $rootScope.preloadPercentage = 0;
        $rootScope.preloadSuccess    = false;
        $rootScope.nextState         = null;

        /********* global data *********/
        $rootScope.articleData = null;
        $rootScope.tagData     = null;
        $rootScope.beaconData  = null;

        $rootScope.get = function (url) {
            console.log("requesting", url);
            var deferred = $q.defer();
            $http.get(url).
                success(function (data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function (data, status, headers, config) {
                    deferred.reject(data);
                });
            return deferred.promise;
        };

        $rootScope.checkPreloadProcess = function () {
            var deferred = $q.defer();
            $timeout(function () {
                $rootScope.preloadSuccess = $rootScope.preloadPercentage >= 100 ? true : false;
                if ($rootScope.preloadSuccess)
                    deferred.resolve($state.go($rootScope.nextState));
                else
                    deferred.reject();
            }, 10);
            return deferred.promise;
        };
    }]);
}());


