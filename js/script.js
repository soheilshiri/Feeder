// http://feeds.narenji.ir/narenji
// http://feeds2.feedburner.com/Line25
// http://p30download.com/fa/main/feed/rss.xml


var app = angular.module('feeder', [])
    .controller('mainController', ['$scope', '$http', function($scope, $http) {


        $scope.url_nums = 0;
        $scope.URL = "";
        $scope.newURL = "";
        $scope.sites = [];

        $scope.add_feed = function() {
            $('.small.modal')
                .modal('show')
            ;
        }

        //SELECT title    FROM   feednormalizer   WHERE  output="atom_1.0" AND
        $scope.YQL = function (URL) {
            $scope.yqlURL = 'https://query.yahooapis.com/v1/public'
                + '/yql?q=SELECT%20title%0AFROM%20%20%20feednormalizer'
                + '%0AWHERE%20%20output%3D%22atom_1.0%22%20AND%20url%3D%22'
                + encodeURIComponent(URL)
                + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
            return $scope.yqlURL;
        }


        $scope.add_url = function(URL) {


            //for(var i = 0; i < url_nums; i++) {
            //    if($('#listID_' + i).attr('URL') == $('#newURL').val() )
            //    {
            //        $('#warning').text('Wrong');
            //        $('#warning').slideDown().delay(300).slideUp(300)
            //        return;
            //    }
            //}

            $scope.newURL = $scope.YQL('http://' + URL);

            //console.log('http://' + URL);
            //console.log($scope.newURL);

            $scope.sites.push($scope.newURL);



            //
            //newDiv.addClass('newItem');
            //newDiv.attr('URL', newURL);
            //newDiv.attr('id', 'listID_' + counter);
            //newDiv.attr('onclick', 'doChange(this)');
            //newDiv.text('Loading ... ');
            //$.getJSON(titleURL, function(json) {
            //    newDiv.text(json.query.results.feed.title);
            //    newDiv.attr('title', json.query.results.feed.title);
            //    localStorage.setItem('List_' + counter, newDiv.clone().wrap('<ul/>').parent().html());
            //    counter++;
            //});
            //
            //$('#newURL').val('');
            //newDiv.hide();
            //newDiv.appendTo('#listOfSite');
            //newDiv.slideDown(200);
            //$('#warning').text('Done');
            //$('#warning').slideDown().delay(100).slideUp(100,function(){
            //    $('#element_to_pop_up').bPopup().close();
            //});

        }


    }]);





var counter = localStorage.length,
    contain = [];
//localStorage.clear();

$(document).ready(function(){
    
    //Load
    for(var i = 0; i < localStorage.length; i++){
        var myList = document.getElementById('listOfSite');
        myList.innerHTML += localStorage.getItem('List_' + i);
        $('#listID_' + i).attr('style', '');
    }
    $('#contain #header').hide();
    $('#load').hide();

    // Click +
    $('#addURL').click(function(){
        $('#element_to_pop_up').bPopup({
            modalColor: '#000'
        });
        $('#newURL').focus();
    }); 
    $('#close').click(function(){
        $('#element_to_pop_up').bPopup().close();
    });
    
    ///// Fetch
    $('#fetchBut').click(function() {
        for(var i = 0; i < counter; i++) {
            if($('#listID_' + i).attr('URL') == $('#newURL').val() )
            {
                $('#warning').text('Wrong');
                $('#warning').slideDown().delay(300).slideUp(300)
                return;
            }
        }
        var newDiv = $(document.createElement('li')),
            newURL = $('#newURL').val(),
            titleURL = makeNewTitle(newURL);

        newDiv.addClass('newItem');
        newDiv.attr('URL', newURL);
        newDiv.attr('id', 'listID_' + counter);
        newDiv.attr('onclick', 'doChange(this)');
        newDiv.text('Loading ... ');
        $.getJSON(titleURL, function(json) {
            newDiv.text(json.query.results.feed.title);
            newDiv.attr('title', json.query.results.feed.title);
            localStorage.setItem('List_' + counter, newDiv.clone().wrap('<ul/>').parent().html());
            counter++;
        }); 

        $('#newURL').val('');
        newDiv.hide();
        newDiv.appendTo('#listOfSite');
        newDiv.slideDown(200); 
        $('#warning').text('Done');
        $('#warning').slideDown().delay(100).slideUp(100,function(){
            $('#element_to_pop_up').bPopup().close();
        });
    });
});

function makeNewRSS(URL) {
    var yqlURL = "https://query.yahooapis.com/v1/public/"
    + "yql?q=select%20title%2C%20description%2C%20pubDate%2C%20link%20from%20rss%20where%20url%3D%22"
    + encodeURIComponent(URL)
    + "%3Falt%3Drss%26format%3Djson%26diagnostics%3Dtrue%22&format=json"
    + "&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";
    console.log(yqlURL);
    return yqlURL;
}

//SELECT title    FROM   feednormalizer   WHERE  output="atom_1.0" AND
function makeNewTitle(URL) {
    var yqlURL = 'https://query.yahooapis.com/v1/public'
    + '/yql?q=SELECT%20title%0AFROM%20%20%20feednormalizer'
    + '%0AWHERE%20%20output%3D%22atom_1.0%22%20AND%20url%3D%22'
    + encodeURIComponent(URL)
    + '%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback='
    return yqlURL;
}

function doChange(DIV){
    
    var yqlURL = makeNewRSS(DIV.getAttribute('url')),
        now = new Date().getTime();
    
    console.log((now -  $(DIV).attr('time')) , '<' , (5*60*100) );
    if((now -  $(DIV).attr('time')) < (5*60*100) ) {
        $('#newSite').remove();
        newSite = contain[DIV.getAttribute('id')];
        newSite.appendTo('#contain');
        $('#contain #header').text(DIV.innerHTML);
        return;
    }
    
    DIV.setAttribute('yqlURL', yqlURL);
    $('#newSite').remove();
    $('#contain #header').hide();
    $('#load').show();
    var start = new Date().getTime();
    $(DIV).attr('time', now);
    console.log(DIV);
    showRSS(DIV);
}

function showRSS(DIV){   
    $.getJSON(DIV.getAttribute('yqlURL'), function(json) {
        $('#contain #header').show();
        $('#load').hide();
        $('#contain #header').text(DIV.innerHTML);
        $('#contain').css('border','2px solid #800080');        
        var newSite = $(document.createElement('div'));
        for(var i=0 ; i < json.query.results.item.length ; i++ ){
            var newTitle = $(document.createElement('div'));
            var newContain = $(document.createElement('div'));
            var newTime = $(document.createElement('div')); 
            var newPost = $(document.createElement('div'));
            newContain.html(json.query.results.item[i].description);
            newTitle.text(json.query.results.item[i].title );
            newTime.text(json.query.results.item[i].pubDate)
            newContain.addClass('post');
            newTitle.addClass('title');
            newTime.addClass('time');
            newTitle.appendTo(newPost);
            newTime.appendTo(newPost);
            newContain.appendTo(newPost);
            newPost.addClass('new');
            newPost.appendTo(newSite);
        }
        newSite.attr('id', 'newSite');
        contain[DIV.getAttribute('id')] = newSite;
        newSite.appendTo('#contain');
    });
}