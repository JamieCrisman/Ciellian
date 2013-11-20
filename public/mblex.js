function blank(obj) { 
    var cache;

    if((cache = typeof obj) !== 'boolean' && (cache !== 'number' || isNaN(obj)) && !obj)
        return true;
    if(cache == 'string' && obj.replace(/\s/g, '').length === 0)
        return true;
    if(cache == 'object') {
        if((cache = toString.call(obj)) == '[object Array]' && obj.length === 0)
            return true;
        if(cache == '[object Object]') {
            for(cache in obj) {
                return false;
            }
            return true;
        }
    }

    return false;
}


var token = null;
$(document).ready(function(){
});

var app = angular.module('mblex', []);
app.controller('mblSystem', function($scope){
	$scope.pass = "";
	$scope.connectionError = null;
	$scope.words = [];
	$scope.page = 0;
	$scope.totalCount = 0;
	$scope.currentTotal = 0;
	$scope.plim = 0;
	$(function() {
		$.ajaxSetup({
			dataType: 'json',
			error: function(jqXHR, exception) {
				if (jqXHR.status === 0) {
					$scope.$apply(function(){
						$scope.connectionError = 'Not connect. Verify Network.';
					});
				} else if (jqXHR.status == 404) {
					$scope.$apply(function(){
						$scope.connectionError = 'Requested page not found. [404]';
					});
				} else if (jqXHR.status == 500) {
					$scope.$apply(function(){
						$scope.connectionError = 'Internal Server Error [500].';
					});
				} else if (exception === 'parsererror') {
					$scope.$apply(function(){
						$scope.connectionError = 'Requested JSON parse failed.';
					});
				} else if (exception === 'timeout') {
					$scope.$apply(function(){
						$scope.connectionError = 'Time out error.';
					});
				} else if (exception === 'abort') {
					$scope.$apply(function(){
						$scope.connectionError = 'Ajax request aborted.';
					});
				}
			}
		});
	});
	$scope.clearConnectionError = function(){
		$scope.connectionError = null;
	}
	//initial load
	$.get("http://127.0.0.1:3000/word", function(data){
		$scope.$apply(function(){
			//$scope.words = data.words;
			$scope.plim = data.limit;
			$scope.totalCount = data.total;
		});
		//$scope.words = data;
		$scope.getMoreWords($scope.page);
		console.log(data);
	});
	$scope.setPage = function(page){
		console.log(page);
		$scope.page = page;
		$scope.getMoreWords($scope.page);
		//TODO: logic to know if we need to query for more words or if we have them loaded already
	}
	$scope.getMoreWords = function(page){
		var d = {"page": page};
		console.log(page);
		console.log(d);
		$.get("http://127.0.0.1:3000/getwords", d, function(data){
			console.log(data);
			$scope.$apply(function(){
				$scope.words = data.words;
				$scope.currentTotal = data.count;
			});
			//TODO: cache words
		})
		console.log("!!!");
	}

});
