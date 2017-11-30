$(document).ready(function() {
	$('#mobile-button').on('click', function(){
		window.location.href="./Mobile.html"
	});

	$('#bigdata-button').on('click', function(){
		console.log("being clicked");
		window.location.href="./BigData.html"
	});

	$('#iot-button').on('click', function(){
		window.location.href="./Iot.html"
	});
});