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
	$("#signup-stripInvalid").on("click", function(){
		$("#newUser").val($("#newUser").val().replace(/\W/g, '').toLowerCase());
	});
});

var app = angular.module('mblex', []);
app.directive('showIf', function(){ 
	return {
		restrict: 'A', //attribute only
		link: function(scope, elem, attr, ctrl) {
			elem.addClass("hide");
			scope.$watch(attr.showIf, function(v){
				var e = Animate(elem[0]);
				if(scope.$eval(attr.showIf)){
					e.remove("fadeOutDown").remove("hide");
					e.add("fadeInUp").end("fadeOutDown",function(){
						console.log("!!");
					});
				}else{
					e.remove("fadeInUp");
					e.add("fadeOutDown").end("fadeOutDown", function(){
						console.log("faded out!");
						elem.addClass("hide");
					});
				}
			});
		}
	};
});

app.controller('mblSystem', function($scope){
	$scope.pass = "";
	$scope.connectionError = null;
	$(function() {
		$.ajaxSetup({
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

	
});
//function monetSystem($scope){
	
//};