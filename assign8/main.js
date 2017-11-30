document.addEventListener("DOMContentLoaded", function() {

	// initMap();
	// parseJSONFile();
});

var locations = [];
var markerData = [];
var maxRevenue = 0;

function parseJSONFile() 
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var JSONObj = JSON.parse(this.responseText);
	        getCoordinates(JSONObj);
	    }
	};
	xmlhttp.open("GET", "companyLocations.json", true);
	xmlhttp.send();
}

function getCoordinates(JSONObj)
{
	for (var i = 0; i < JSONObj.locations.location.length; i++) 
	{
		var temp = {};
		temp["lat"] = JSONObj.locations.location[i].latitude;
		temp["lng"] = JSONObj.locations.location[i].longitude;
		locations.push(temp);

		temp = {};
		temp["type"] = JSONObj.locations.location[i].type;
		temp["revenue"] = JSONObj.locations.location[i].$revenue;
		markerData.push(temp);

		if (JSONObj.locations.location[i].$revenue > maxRevenue)
			maxRevenue = JSONObj.locations.location[i].$revenue;
	}
}

function initMap()
{
	var uluru = {lat: 37.421633, lng: -122.08658};
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 8,
		center: uluru
	});

	var markers = locations.map(function(location, i) {
		var image = "%E2%80%A2";
		var color = "00E500";
		var size = 0.5;
		if (markerData[i].type == "Distribution Facility") {
			color = 'FF0000';
		} else if (markerData[i].type == "HeadQuarters") {
			color = 'FFFFFF';
		} else if (markerData[i].type == "Call Center") {
			color = '0000FF';
		} else if (markerData[i].type == "RetailLocation") {
			color = '00E500';
			size += (markerData[i].revenue / maxRevenue);
		}

		custom_icon = 'http://chart.apis.google.com/chart?chst=d_map_spin&chld='+size+'|0|'+color+'|20|b|'+image;
		return new google.maps.Marker({
			position: location,
			icon: custom_icon
		});
	});

	var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}

parseJSONFile();
