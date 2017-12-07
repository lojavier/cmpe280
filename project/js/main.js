if (window.location.protocol != 'https:') {
	window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
}

var warningMessage = null;
var directionsService = null;
var directionsDisplay = null;
var geocoder = null;
var trafficLayer = null;
var map = null;
var pickup_lat = 37.3367759;	// Default
var pickup_lng = -121.8785638;	// Default
var dropoff_lat = null;
var dropoff_lng = null;
var routeFlag = [false,false];
var lyft_prices = [0,0,0,0,0,0,0,0];
var uber_prices = [0,0,0,0,0,0,0,0];

function initGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, showError);
        // navigator.geolocation.watchPosition(updateLatLng, showError);
    } else {
        warningMessage.innerHTML = "Geolocation is not supported by this browser.";
        initMap(null);
    }
}

function showError(error) {
	
    switch(error.code) {
        case error.PERMISSION_DENIED:
            warningMessage.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            warningMessage.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            warningMessage.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            warningMessage.innerHTML = "An unknown error occurred."
            break;
    }
    initMap(null);
    $("#warning-div").show();
    setTimeout(function(){$("#warning-div").hide();}, 10000);
}

function initMap(position) {

	if(position) {
		pickup_lat = position.coords.latitude;
		pickup_lng = position.coords.longitude;
	}

	directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    geocoder = new google.maps.Geocoder();
    trafficLayer = new google.maps.TrafficLayer();

	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: pickup_lat, lng: pickup_lng},
		zoom: 17,
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false,
		zoomControl: false
	});
	
	directionsDisplay.setMap(map);
	trafficLayer.setMap(map);

	// var tripRouteDisplay = document.getElementById('trip-route-display');
	// map.controls[google.maps.ControlPosition.TOP_CENTER].push(tripRouteDisplay);
	// $("#trip-route-display").show();

	var input = [];
	input.push(document.getElementById('pickup-input'));
	input.push(document.getElementById('dropoff-input'));

	var autocomplete = [false,false];
	for(var i = 0; i < autocomplete.length; i++)
	{
		autocomplete[i] = new google.maps.places.Autocomplete(input[i]);
		autocomplete[i].bindTo('bounds', map);
		var marker = new google.maps.Marker({
			map: map,
			anchorPoint: new google.maps.Point(0, -29)
		});
		autocomplete[i].addListener('place_changed', makeAutocompleteCallback(marker, autocomplete[i]));
	}

	geocodeAddress(); // Ran once at load
	reverseGeocodeAddress(geocoder,map);
}

function makeAutocompleteCallback(marker, autocomplete) {
	var autocompleteCallback = function() {
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			// console.log("Error: Not valid address/route");
			return;
		}

		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);  // Why 17? Because it looks good.
		}
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		geocodeAddress();
	}
	return autocompleteCallback;
}

function geocodeAddress() {
	var pickup_address = document.getElementById('pickup-input').value;
	var dropoff_address = document.getElementById('dropoff-input').value;

	var address = [pickup_address, dropoff_address];

	for(var addressIndex = 0; addressIndex < address.length; addressIndex++)
	{
		geocoder.geocode({'address': address[addressIndex]}, makeGeocodeCallback(addressIndex));
	}
}

function reverseGeocodeAddress(geocoder, map) {
	// var latlng = {lat: parseFloat(pickup_lat), lng: parseFloat(pickup_lng)};
	var latlng = {lat: pickup_lat, lng: pickup_lng};
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				var marker = new google.maps.Marker({
					position: latlng,
					map: map
				});
				$("#pickup-input").val(results[0].formatted_address);
			} else {
				console.log('No results found');
			}
		} else {
			console.log('Geocoder failed due to: ' + status);
		}
	});
}

function makeGeocodeCallback(addressIndex) {
	var geocodeCallback = function(results, status) {
		if (status === 'OK') {
			var obj = JSON.parse(JSON.stringify(results));
			setLatLng(addressIndex, obj[0].geometry.location.lat, obj[0].geometry.location.lng);
			calculateAndDisplayRoute();
		} else {
			// console.log('Geocode was not successful for the following reason: ' + status);
			resetLatLng(addressIndex);
		}
	};
	return geocodeCallback;
}

function setLatLng(addressIndex, latitude, longitude) {
	if(addressIndex == 0) {
		pickup_lat = latitude;
		pickup_lng = longitude;
		
	} else {
		dropoff_lat = latitude;
		dropoff_lng = longitude;
	}
	routeFlag[addressIndex] = true;
}

function resetLatLng(addressIndex) {
	if(addressIndex == 0) {
		pickup_lat = null;
		pickup_lng = null;
	} else {
		dropoff_lat = null;
		dropoff_lng = null;
	}
	routeFlag[addressIndex] = false;
}

function calculateAndDisplayRoute() {
	if(routeFlag[0] == true && routeFlag[1] == true) 
	{
		$("#fare-estimates").hide();
		directionsService.route({
			origin: document.getElementById('pickup-input').value,
			destination: document.getElementById('dropoff-input').value,
			travelMode: 'DRIVING'
		}, function(response, status) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response);
				getUberEstimates();
				getLyftEstimates();
				$("#fare-estimates").show();

				setTimeout(function(){
					// document.getElementById("fare-estimates").scrollIntoView(true);
					$('html, body').animate({
				        scrollTop: $("#fare-estimates").offset().top
				    }, 1000);
				}, 2000);
			} else {
				console.log('ROUTE FAILED: ' + status);
			}
		});
	}
}

function getLyftEstimates() {
	var lyft_client_id = "GOVksbfrhvtf";
	var lyft_client_token = "Uz0CSUD07d/xef+lDlG0nvNa0KkybaHXmdjGZem1OLfxfL0E2PBgwCjEEwRzOsTlEkg8PQ1i43U7l4IHVTSw0hGYEDBXA9uL39rkagTt9beOmbBpwQN0eoA=";
	var lyft_client_secret = "ItZ4rCtEeAWnRKqShT-jlCh7I5TLHtUW";
	var lyft_estimates_url = "https://api.lyft.com/v1/cost?start_lat="+pickup_lat+"&start_lng="+pickup_lng+"&end_lat="+dropoff_lat+"&end_lng="+dropoff_lng;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var JSONObj = JSON.parse(this.responseText);
	        displayLyftEstimates(JSONObj,lyft_client_id);
		}
	};
	xhttp.open("GET", lyft_estimates_url, true);
	xhttp.setRequestHeader("Authorization", "bearer " + lyft_client_token);
	xhttp.send();
}

function displayLyftEstimates(JSONObj,lyft_client_id) {

	var rideIndex = {
		lyft_line:0,
		lyft:1,
		lyft_plus:2,
		lyft_premier:3,
		lyft_lux:4,
		lyft_luxsuv:5
	};
	var results = [rideIndex.length];

	for (var i = 0; i < JSONObj.cost_estimates.length; i++) 
	{
		switch(JSONObj.cost_estimates[i].ride_type) {
			case 'lyft_line':
				index = rideIndex.lyft_line;
		        break;
		    case 'lyft':
		        index = rideIndex.lyft;
		        break;
			case 'lyft_plus':
		        index = rideIndex.lyft_plus;
		        break;
		    case 'lyft_premier':
		        index = rideIndex.lyft_premier;
		        break;
		    case 'lyft_lux':
		        index = rideIndex.lyft_lux;
		        break;
		    case 'lyft_luxsuv':
		        index = rideIndex.lyft_luxsuv;
		        break;
		    default:
		        break;
		}
		results[index] = JSONObj.cost_estimates[i];
	}

	lyft_prices = [];

	var lyft_deep_link = "https://lyft.com/ride";	
	for (var i = 0; i < results.length; i++)
	{
		lyft_prices.push(parseFloat((results[i].estimated_cost_cents_min/100).toFixed(2)));

		var lyft_app_link = lyft_deep_link+"?id="+results[i].ride_type+"&partner="+lyft_client_id+"&pickup[latitude]="+pickup_lat+"&pickup[longitude]="+pickup_lng+"&destination[latitude]="+dropoff_lat+"&destination[longitude]="+dropoff_lng;

		$("#lyft-estimate-"+i).html("");
		$("#lyft-estimate-"+i).append(" \
			<div class=\"w3-container w3-white w3-center\"> \
				<img src=\"images/lyft_logo.jpg\" alt=\"Lyft\" style=\"display:block; margin:auto; width:60%; max-width:300px;\"> \
			</div> \
            <div class=\"w3-container w3-white w3-center\"> \
            	<h3>"+results[i].display_name+"</h3> \
            	<p class=\"w3-text-green\">$"+(results[i].estimated_cost_cents_min/100).toFixed(2)+" (Estimated Ride Cost)</p> \
                <p>"+Math.ceil((results[i].estimated_duration_seconds/60))+" mins (Estimated Ride Duration)</p> \
                <p>"+results[i].estimated_distance_miles+" miles (Estimated Ride Distance)</p> \
            	<button class=\"w3-button w3-margin-bottom w3-blue-grey\" onclick=\"window.open(\'"+lyft_app_link+"\');\">Request Ride <span class=\"glyphicon glyphicon-new-window\"></span></button> \
            </div>");
	}
}

function getUberEstimates() {
	var uber_access_token = "KA.eyJ2ZXJzaW9uIjoyLCJpZCI6InB6YnJrZzNlU0RLSlpacGZkNnhacUE9PSIsImV4cGlyZXNfYXQiOjE1MTUyMjMyNDUsInBpcGVsaW5lX2tleV9pZCI6Ik1RPT0iLCJwaXBlbGluZV9pZCI6MX0.IO22hUn1WE8v4CioDz-S4O_CfWl6hoQSJFxm4BteMvw";
	var uber_client_id = "3JajizBicUQTjxJrh8R0iDgt_HUBCJWS";
	var uber_client_secret = "5NAqxlNLlRMXne7TVyUzQgxR91fN6tMzkKQFgXNM";
	var uber_server_token = "RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn";
	var uber_estimates_price_url = "https://api.uber.com/v1.2/estimates/price";
	
	$.ajax({
		url: uber_estimates_price_url,
		type: "GET",
		data: {
	        start_latitude: pickup_lat,
		    start_longitude: pickup_lng,
		    end_latitude: dropoff_lat,
		    end_longitude: dropoff_lng,
		    server_token: uber_server_token
	    },
		success: function(result,status,xhr) {
	        displayUberEstimates(result,uber_client_id);
	    },
	    error: function(xhr,status,error) {
	    	console.log(JSON.stringify(xhr));
	    	console.log(JSON.stringify(status));
	    	console.log(JSON.stringify(error));
	    }
	});
}

function displayUberEstimates(JSONObj,uber_client_id) {

	var rideIndex = {
		POOL:0,
		uberX:1,
		uberXL:2,
		SELECT:3,
		BLACK:4,
		SUV:5,
		ASSIST:6,
		WAV:7
	};
	var results = [rideIndex.length];
	
	for (var i = 0; i < JSONObj.prices.length; i++)
	{
		switch(JSONObj.prices[i].localized_display_name) {
			case 'POOL':
				index = rideIndex.POOL;
		        break;
		    case 'uberX':
		        index = rideIndex.uberX;
		        break;
			case 'uberXL':
		        index = rideIndex.uberXL;
		        break;
		    case 'SELECT':
		        index = rideIndex.SELECT;
		        break;
		    case 'BLACK':
		        index = rideIndex.BLACK;
		        break;
		    case 'SUV':
		        index = rideIndex.SUV;
		        break;
		    case 'ASSIST':
		        index = rideIndex.ASSIST;
		        break;
		    case 'WAV':
		        index = rideIndex.WAV;
		        break;
		    default:
		        break;
		}
		results[index] = JSONObj.prices[i];
	}

	uber_prices = [];

	var uber_deep_link = "https://m.uber.com/";
	if( screen.width <= 480 ) {     
		uber_deep_link += "ul/";
	}
	for (var i = 0; i < results.length; i++) 
	{
		uber_prices.push(parseFloat(results[i].high_estimate));

		var uri = uber_deep_link+"?client_id="+uber_client_id+"&action=setPickup&pickup[latitude]="+pickup_lat+"&pickup[longitude]="+pickup_lng+"&pickup[formatted_address]="+$("#pickup-input").val()+"&dropoff[latitude]="+dropoff_lat+"&dropoff[longitude]="+dropoff_lng+"&dropoff[formatted_address]="+$("#dropoff-input").val()+"&product_id="+results[i].product_id;
		var uber_app_link = encodeURI(uri);

		$("#uber-estimate-"+i).html("");
		$("#uber-estimate-"+i).append(" \
			<div class=\"w3-container w3-white w3-center\"> \
			<img src=\"images/uber_logo.jpg\" alt=\"Uber\" style=\"display:block; margin:auto; width:60%; max-width:300px;\"> \
			</div> \
            <div class=\"w3-container w3-white w3-center\"> \
            	<h3>"+results[i].display_name+"</h3> \
            	<p class=\"w3-text-green\">$"+results[i].low_estimate+" - "+results[i].high_estimate+" (Estimated Ride Cost)</p> \
                <p>"+Math.ceil(results[i].duration/60)+" mins (Estimated Ride Duration)</p> \
                <p>"+results[i].distance+" miles (Estimated Ride Distance)</p> \
            	<button class=\"w3-button w3-margin-bottom w3-blue-grey\" onclick=\"window.open(\'"+uber_app_link+"\');\">Request Ride <span class=\"glyphicon glyphicon-new-window\"></span></button> \
            </div>");
	}
}

function displayHighchart()
{
    var ride_types = ["ECONOMY","STANDARD","STANDARD XL","PREMIUM","LUXURY","LUXURY XL","ASSIST","WAV"];

    Highcharts.chart('highchart', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Rideshare Fare Comparison'
        },
        subtitle: {
            text: 'Last Update: TODAY'
        },
        xAxis: {
            categories: ride_types,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Fare Price (USD)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b> ${point.y:.2f} USD</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Lyft',
            data: lyft_prices
        }, {
            name: 'Uber',
            data: uber_prices
        }]
    });
}

$(document).ready(function() {
	warningMessage = document.getElementById("warning-message");
	// $("#trip-route-display").hide();
	$("#warning-div").hide();
	$("#fare-estimates").hide();

	$("#high-chart-toggle").click(function(){
		displayHighchart();
	});
	$("#contact-btn").click(function(){
		$('html, body').animate({
	        scrollTop: $("#contact").offset().top
	    }, 500);
	});
});
