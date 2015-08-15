// http://feeds.narenji.ir/narenji
// http://
// feeds2.feedburner.com/Line25
// http://p30download.com/fa/main/feed/rss.xml


var app = angular.module('feeder', [])
    .filter("sanitize", ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
    }])
    .controller('mainController', ['$scope', '$http', function($scope, $http) {

        $scope.url_nums = 0;
        $scope.URL = "";
        $scope.site_loader = false;
        $scope.load_active = "";

        // Load from LocalStorage
        if (JSON.parse(localStorage.getItem('DATA')) == null)
            $scope.sites = [];
        else
            $scope.sites = JSON.parse(localStorage.getItem('DATA'));

        $scope.results;

        // Show Feed
        $scope.show = function(index) {
            $scope.load_active = "active";
            $scope.results = "";

            $http({
                url : $scope.sites[index]['rss'],
                method : 'GET'
            })
                .success(function(data){
                    $scope.results = data['query']['results']['item'];
                    $scope.load_active = "";

                    console.log($scope.results);
                })
                .error(function(error) {
                    console.error(error);
                });
        }


        // For Modal of Add New Item
        $scope.add_feed = function() {
            $('.small.modal')
                .modal('show')
            ;
        }

        // SELECT title FROM feed normalizer WHERE output="atom_1.0" AND
        $scope.YQL_title = function (URL) {
            $scope.yqlURL = 'https://query.yahooapis.com/v1/public'
                + '/yql?q=SELECT%20title%0AFROM%20%20%20feednormalizer'
                + '%0AWHERE%20%20output%3D%22atom_1.0%22%20AND%20url%3D%22'
                + encodeURIComponent(URL)
                + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
            return $scope.yqlURL;
        }

        $scope.YQL_rss = function (URL) {
            $scope.yqlURL = "https://query.yahooapis.com/v1/public/"
                + "yql?q=select%20title%2C%20description%2C%20pubDate%2C%20link%20from%20rss%20where%20url%3D%22"
                + encodeURIComponent(URL)
                + "%3Falt%3Drss%26format%3Djson%26diagnostics%3Dtrue%22&format=json"
                + "&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
            return $scope.yqlURL;
        }


        // Add a New Item
        $scope.add_url = function(URL) {
            $scope.site_loader = true;

            $scope.url_title = $scope.YQL_title('http://' + URL);
            $scope.url_rss = $scope.YQL_rss('http://' + URL);

            $http({
                url : $scope.url_title,
                method : 'GET'
            })
                .success(function(data){
                    $scope.site_loader = false;
                    $scope.name_results = data['query']['results'];
                    $scope.sites.push({ url: URL, rss:  $scope.url_rss, name: $scope.name_results["feed"]["title"]});
                    // Save to LocalStorage
                    localStorage.setItem('DATA', JSON.stringify($scope.sites));
                })
                .error(function(error) {
                    console.error(error);
            });

        }

    }]);

