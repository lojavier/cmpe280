var warningMessage = null;
var directionsService = null;
var directionsDisplay = null;
var geocoder = null;
var map = null;
var pickup_lat = 37.3367759;
var pickup_lng = -121.8785638;
var dropoff_lat = null;
var dropoff_lng = null;
var routeFlag = [false,false];

function initGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, showError);
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
		warningMessage.innerHTML = "Latitude: " + pickup_lat + " Longitude: " + pickup_lng;
	}

	directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
    geocoder = new google.maps.Geocoder();
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: pickup_lat, lng: pickup_lng},
		zoom: 14,
		mapTypeControl: false,
		fullscreenControl: false,
		streetViewControl: false,
		zoomControl: false
	});
	
	directionsDisplay.setMap(map);

	var tripRouteDisplay = document.getElementById('trip-route-display');
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(tripRouteDisplay);

	var input = [];
	input.push(document.getElementById('pickup-input'));
	input.push(document.getElementById('dropoff-input'));
	// var pickupInput = document.getElementById('pickup-input');
	// var dropoffInput = document.getElementById('dropoff-input');

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

	// document.getElementById('pickup-input').addEventListener('change', onChangeHandler);
 //    document.getElementById('dropoff-input').addEventListener('change', onChangeHandler);
 	// document.getElementById('pickup-input').addEventListener('blur', onChangeHandler);
  //   document.getElementById('dropoff-input').addEventListener('blur', onChangeHandler);
}

function makeAutocompleteCallback(marker, autocomplete) {
	var autocompleteCallback = function() {
		// alert("address changed");
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			alert("Error: Not valid address/route");
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
		// alert(address[addressIndex]);
		geocoder.geocode({'address': address[addressIndex]}, makeGeocodeCallback(addressIndex));
	}
}

function makeGeocodeCallback(addressIndex) {
	// alert("addressIndex: " + JSON.stringify(addressIndex));
	var geocodeCallback = function(results, status) {
		if (status === 'OK') {
			var obj = JSON.parse(JSON.stringify(results));
			var latitude = obj[0].geometry.location.lat;
			var longitude = obj[0].geometry.location.lng;
			// if(addressIndex == 0)
			// {
			// 	map.setCenter(results[0].geometry.location);
			// 	var marker = new google.maps.Marker({
			// 		map: map,
			// 		position: results[0].geometry.location
			// 	});
			// }
			// alert("addressIndex: " + addressIndex);
			setLatLng(addressIndex, latitude, longitude);
			calculateAndDisplayRoute();
		} else {
			// alert('Geocode was not successful for the following reason: ' + status);
			resetLatLng(addressIndex, latitude, longitude);
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

function resetLatLng(addressIndex, latitude, longitude) {
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
		directionsService.route({
			origin: document.getElementById('pickup-input').value,
			destination: document.getElementById('dropoff-input').value,
			travelMode: 'DRIVING'
		}, function(response, status) {
			if (status === 'OK') {
				directionsDisplay.setDirections(response);
				// getLyftEstimates();
				getUberEstimates();
			} else {
				// alert('ROUTE FAILED: ' + status);
			}
		});
	}
}

function getLyftEstimates() {
	/*
	curl --include -X GET -H 'Authorization: bearer Uz0CSUD07d/xef+lDlG0nvNa0KkybaHXmdjGZem1OLfxfL0E2PBgwCjEEwRzOsTlEkg8PQ1i43U7l4IHVTSw0hGYEDBXA9uL39rkagTt9beOmbBpwQN0eoA=' \
	'https://api.lyft.com/v1/cost?start_lat=37.3120321&start_lng=-121.95222860000001&end_lat=37.3844772&end_lng=-121.93272890000003'
	*/

	var lyft_client_id = "GOVksbfrhvtf";
	var lyft_client_token = "Uz0CSUD07d/xef+lDlG0nvNa0KkybaHXmdjGZem1OLfxfL0E2PBgwCjEEwRzOsTlEkg8PQ1i43U7l4IHVTSw0hGYEDBXA9uL39rkagTt9beOmbBpwQN0eoA=";
	var lyft_client_secret = "ItZ4rCtEeAWnRKqShT-jlCh7I5TLHtUW";
	var lyft_estimates_url = "https://api.lyft.com/v1/cost?start_lat="+pickup_lat+"&start_lng="+pickup_lng+"&end_lat="+dropoff_lat+"&end_lng="+dropoff_lng;

	// alert(lyft_estimates_url);

	// var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function() {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		document.getElementById("demo2").innerHTML = this.responseText;
	// 		warningMessage.innerHTML = this.responseText;
	// 	}
	// };
	// xhttp.open("GET", lyft_estimates_url, true);
	// xhttp.setRequestHeader("Authorization", "bearer " + lyft_client_token);
	// xhttp.send();

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        // var JSONObj = JSON.parse(this.responseText);
	        // document.getElementById("demo2").innerHTML = JSON.stringify(JSONObj);
	        // displayLyftEstimates(JSONObj);
	        warningMessage.innerHTML = this.responseText;
	    }
	};
	xmlhttp.open("GET", "lyftPrices.json", true);
	xmlhttp.send();
	
}

function displayLyftEstimates(JSONObj) {
	
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
		        //code block
		}
		results[index] = JSONObj.cost_estimates[i];
	}
	var temp = "";
	for (var i = 0; i < results.length; i++) 
	{
		temp += results[i].ride_type + "<br>";
		temp += results[i].estimated_duration_seconds + " seconds <br>";
		temp += results[i].estimated_distance_miles + " miles<br>";
		temp += results[i].estimated_cost_cents_max + " cents<br>";
		temp += results[i].primetime_percentage + "<br>";
		temp += results[i].is_valid_estimate + "<br>";
		temp += results[i].currency + "<br>";
		temp += results[i].cost_token + "<br>";
		temp += results[i].estimated_cost_cents_min + " cents <br>";
		temp += results[i].display_name + "<br>";
		temp += results[i].primetime_confirmation_token + "<br>";
		temp += results[i].can_request_ride + "<br>";
		temp += "<br>";
	}
	document.getElementById("demo2-0").innerHTML = temp;
}

function getUberEstimates() {
	/*
	curl -H 'Authorization: Token RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn' \
	     -H 'Accept-Language: en_US' \
	     -H 'Content-Type: application/json' \
	     'https://api.uber.com/v1.2/estimates/price?start_latitude=37.3120321&start_longitude=-121.95222860000001&end_latitude=37.3844772&end_longitude=-121.93272890000003&server_token=RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn'
	*/

	var uber_client_id = "3JajizBicUQTjxJrh8R0iDgt_HUBCJWS";
	var uber_server_token = "RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn";
	var uber_estimates_url = "https://api.uber.com/v1.2/estimates/price?start_latitude="+pickup_lat+"&start_longitude="+pickup_lng+"&end_latitude="+dropoff_lat+"&end_longitude="+dropoff_lng+"&server_token="+uber_server_token;

	// alert(uber_estimates_url);

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        // var JSONObj = JSON.parse(this.responseText);
	        // document.getElementById("demo1").innerHTML = JSON.stringify(JSONObj);
	        // displayUberEstimates(JSONObj);
	        warningMessage.innerHTML = this.responseText;
	    }
	};
	xmlhttp.open("GET", "uberPrices.json", true);
	xmlhttp.send();

	// var xmlhttp = new XMLHttpRequest();
	// xmlhttp.onreadystatechange = function() {
	//     if (this.readyState == 4 && this.status == 200) {
	//         var JSONObj = JSON.parse(this.responseText);
	//         document.getElementById("demo1").innerHTML = JSON.stringify(JSONObj);
	//         warningMessage.innerHTML = this.responseText;
	//     }
	// };
	// xmlhttp.open("GET", uber_estimates_url, true);
	// xmlhttp.send();

}

function displayUberEstimates(JSONObj) {

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
		        //code block
		}
		results[index] = JSONObj.prices[i];
	}
	var temp = "";
	for (var i = 0; i < results.length; i++) 
	{
		temp += results[i].localized_display_name + "<br>";
		temp += results[i].distance + " miles <br>";
		temp += results[i].display_name + "<br>";
		temp += results[i].product_id + "<br>";
		temp += results[i].high_estimate + "<br>";
		temp += results[i].low_estimate + "<br>";
		temp += results[i].duration + " seconds <br>";
		temp += results[i].estimate + "<br>";
		temp += results[i].currency_code + "<br>";
		temp += "<br>";
	}
	document.getElementById("demo1-0").innerHTML = temp;

}

$(document).ready(function() {
	warningMessage = document.getElementById("warning-message");
	$("#warning-div").hide();
});