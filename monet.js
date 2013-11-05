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
	/*
	$(".animated").one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function (e) {
		if($(this).hasClass("fadeOutDown")){
			console.log("faded out!");
		}
	});
	*/
	/*
	$("#registerUser").submit(function(e){
		e.preventDefault();
		$("#registerErrors").text("").removeClass("show");
		var usrData = {username: $("#newUser").val(), password: $("#newPassword").val(), confirmPassword: $("#confirmPassword").val()};
		var cleanUser = usrData["username"].replace(/\W/g, '');
		if(cleanUser != usrData["username"]){
			$("#registerErrors").text("alphanumeric only for username").addClass("show");
			return;
		}
		usrData["username"] = cleanUser;
		if(usrData["password"] != usrData["confirmPassword"]){
			$("#registerErrors").text("Passwords do not match!").addClass("show");
			return;
		}
		usrData["password"] = usrData["password"].split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
		usrData["confirmPassword"] = usrData["confirmPassword"].split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
		
		$.post("http://127.0.0.1:3000/user", usrData, function(resp){
			//console.log(resp);
			//token = resp
		}).success(function(data){
			token = data;
		}).error(function(a,b,data){
			//console.log(a["responseJSON"]["message"]);
			$("#registerErrors").text(a["responseJSON"]["message"]).addClass("show");
		}).fail(function(a,b,data){
			$("#registerErrors").text(a["responseJSON"]["message"]).addClass("show");
		});
		
	});
	*/
	/*
	$("#loginUser").submit(function(e){
		e.preventDefault();
		$("#loginErrors").text("").removeClass("show");
		var usrData = {username: $("#user").val(), password: $("#password").val()};
		var cleanUser = usrData["username"].replace(/\W/g, '');
		if(cleanUser != usrData["username"]){
			$("#loginErrors").text("Invalid username").addClass("show");
			return;
		}
		usrData["password"] = usrData["password"].split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
		$.post("http://127.0.0.1:3000/login", usrData, function(resp){
			//console.log(resp);
			//token = resp
		}).success(function(data){
			token = data;
		}).error(function(a,b,data){
			//console.log(a["responseJSON"]["message"]);
			$("#registerErrors").text(a["responseJSON"]["message"]).addClass("show");
		}).fail(function(a,b,data){
			$("#registerErrors").text(a["responseJSON"]["message"]).addClass("show");
		});
	});*/
});

var app = angular.module('monet', []);
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

app.controller('monetSystem', function($scope){
	$scope.user = {username: null, token: null};
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
	$scope.login = function(){
		$scope.user.username = $scope.user.username.replace(/\W/g, '').toLowerCase();
		var usrData = {username: $scope.user.username, password: $("#password").val()};
		if(blank(usrData["username"]) || blank(usrData["password"])) return; //don't bother if it's not there		
		usrData["password"] = (usrData["password"] + "").split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
		$.post("http://127.0.0.1:3000/login", usrData).success(function(response, status){
			if(response["token"] !== undefined){
				$scope.$apply(function(){
					$scope.user.token = response["token"];
				});
			}
		}).error(function(response, status, data){
			$("#loginErrors").text(response["responseJSON"]["message"]).show();
		});
	}

	$scope.signup = function(){
		$("#signup-stripInvalid, #registerErrors").hide();
		var usrData = {
			username: $("#newUser").val(),
			password: ($("#newPassword").val() + "").split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0),
			confirmPassword: ($("#confirmPassword").val() + "").split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
		};
		if(blank(usrData["username"]) || blank(usrData["password"]) || blank(usrData["confirmPassword"]) ) return; //don't bother if it's not there
		if(usrData["username"].replace(/\W/g, '') != usrData["username"]){
			$("#registerErrors").text("Invalid username: a-z 0-9").show();
			$("#signup-stripInvalid").show();
			return;
		}
		if(usrData["password"] != usrData["confirmPassword"]){
			$("#registerErrors").text("Passwords don't match").show();
		}
		console.log(usrData);
		$.post("http://127.0.0.1:3000/user", usrData).success(function(response, status){
			if(response["token"] !== undefined){
				$scope.$apply(function(){
					$scope.user.token = response["token"];
				});
			}
		}).error(function(response, status, data){
			$("#registerErrors").text(response["responseJSON"]["message"]).show();
				
		});
	}

	$scope.statChart = function(){
		var chartData = {
			labels: ["Strength", "Stamina", "Speed", "Defense", "Perception", "Intelligence"],
			datasets: [{
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : [36,32,37,38,31,39]
			}]
		};
		var chart = new Chart($("#statChart").get(0).getContext("2d")).Radar(chartData);
	}
	$scope.statChart();
});
//function monetSystem($scope){
	
//};