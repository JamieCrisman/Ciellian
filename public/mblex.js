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

var app = angular.module('mblex', ['ngAnimate']);
app.filter('getByProperty', function() {
    return function(propertyName, propertyValue, collection) {
        var i=0, len=collection.length;
        for (; i<len; i++) {
            if (collection[i][propertyName] == +propertyValue) {
                return collection[i];
            }
        }
        return null;
    }
});
app.controller('mblSystem', function($scope, $filter){
	$scope.pass = "";
	$scope.connectionError = null;
	$scope.words = [];
	$scope.page = 0;
	$scope.totalCount = 0;
	$scope.currentTotal = 0;
	$scope.plim = 0;
	$scope.searchBy = "";
	$scope.pageLimit = 50;
	$scope.focusWord = null;
	$scope.wordFocused = false;
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
	$.get("http://192.168.1.19:3000/word", function(data){
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
		//console.log(page);
		$scope.page = page;
		//$scope.getMoreWords($scope.page);
		//TODO: logic to know if we need to query for more words or if we have them loaded already
	}
	$scope.getMoreWords = function(page){
		var d = {"page": page};
		$.get("http://192.168.1.19:3000/getwords", d, function(data){
			//console.log(data);
			$scope.$apply(function(){
				$scope.words = data.words;
				//console.log($scope.words);
				/*$.each(data.words, function(index, value){
					//console.log(value.name);
					$scope.words[value.name] = value;
				});
				console.log($scope.words);
				*/
				$scope.currentTotal = data.count;

			});
			//TODO: cache words
		});
	}
	/*
	$scope.getWord = function(w){
		if(!blank($scope.words[word])){
			$scope.focusWord = $scope.words[word];
		}else{
			$.get("http://127.0.0.1:3000/word/"+word, function(data){
				console.log(data);
				$scope.focusWord = data;
			});
		}
		
		console.log(w);
		console.log($scope.words);
		console.log($filter('getByProperty')('name', w, $scope.words));
		$scope.focusWord = $filter('getByProperty')('name', w, $scope.words);
	}
	*/
	$scope.clearFocusWord = function(){
		$scope.wordFocused = false;
		$scope.focusWord = null;
	}
	$scope.getWord = function(n) {
		var found = $filter('filter')($scope.words, {name: n}, true);
		//console.log(found[0]);
		if (found.length) {
			$scope.focusWord = found[0];
			$scope.wordFocused = true;
		} else {
			$scope.focusWord = null;
		}
	}
	$scope.filteredWords = [];
	$scope.filterWords = function(){
		console.log("!!!");
		if(!blank($scope.searchBy) && $scope.searchBy == $scope.filterQ){
			var found = $filter('filter')($scope.words, $scope.searchBy, false);
			//console.log(found[0]);
			if (found.length) {
				$scope.currentTotal = found.length;
				if($scope.page > ($scope.currentTotal / $scope.pageLimit)-1){
					$scope.page = 0; //failsafe reset to pg 1
				}
				$scope.filteredWords = found;
			} else {
				$scope.currentTotal = 0;
				$scope.filteredWords = [];
			}
		}else{
			$scope.currentTotal = $scope.words.length;
			$scope.filteredWords = $scope.words;
		}
		return $scope.wordsOnPage($scope.filteredWords);
	}

	$scope.wordsOnPage = function(w){
		if(w){
			return w.slice($scope.page * $scope.pageLimit, $scope.page*$scope.pageLimit+$scope.pageLimit);
		}else{
			return [];
		}
	}

});
