var start_latitude = "37.312014";
var start_longitude = "-121.952225";
var end_latitude = "37.3844772";
var end_longitude = "-121.93272890000003";
var seat_count = "";

function testAPI() {
	$.ajax({
		url: "https://login.uber.com/oauth/v2/authorize?client_id="+uber_client_id+"&response_type=code",
		type: "GET",
		success: function(JsonData) {
			// alert(JSON.stringify(JsonData));
			document.getElementById("results").innerHTML = JSON.stringify(JsonData);
			// console.log(JsonData);
		},
		error: function(error) {
			// alert(error);
			document.getElementById("results").innerHTML = "error: " + JSON.stringify(error);
			// console.log(error);
		}
   	});
}

function getPriceEstimates() {
	// alert(estimates_price_url);
	var auth_tok = "Token " + uber_server_token;
	$.ajax({
		url: estimates_price_url,
		type: "GET",
		xhrFields: {
			withCredentials: true
		},
		// crossDomain: true,
		// headers: {
		// 	'Access-Control-Allow-Credentials': 'true',
		// 	'Authorization': auth_tok,
		// 	'Accept-Language': 'en_US'
		// },
		// contentType: 'application/json',
		beforeSend: function (xhr) {
			var auth_tok = "Token " + uber_server_token;
			// xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Access-Control-Allow-Credentials');
			// xhr.setRequestHeader('Access-Control-Allow-Headers', 'Credentials');
			xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
			// xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
			// xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			xhr.setRequestHeader('Authorization', auth_tok);
			xhr.setRequestHeader('Accept-Language', 'en_US');
			xhr.setRequestHeader('Content-Type', 'application/json');
			// xhr.withCredentials = true;
		},
		success: function(JsonData) {
			// alert('success');
			document.getElementById("results").innerHTML = JSON.stringify(JsonData);
			// console.log(JsonData);
		},
		error: function(error) {
			// alert('error');
			document.getElementById("results").innerHTML = "error: " + JSON.stringify(error);
			// console.log(error);
		}
   	});
   	// alert('done');
}

function getPriceEstimates2() {

	// var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function() {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		document.getElementById("demo2").innerHTML = this.responseText;
	// 	}
	// };
	// xhttp.open("GET", estimates_price_url, true);
	// xhttp.setRequestHeader('Access-Control-Allow-Origin', '*');
	// xhttp.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	// xhttp.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
	// xhttp.setRequestHeader('Access-Control-Allow-Credentials', true);
	// xhttp.setRequestHeader("Authorization", "Token " + uber_server_token);
	// xhttp.setRequestHeader("Content-Type", "application/json");
	// xhttp.setRequestHeader("Accept-Language", "en_US");
	// xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
	// xhttp.setRequestHeader("Access-Control-Allow-Headers", "Origin,Access-Control-Allow-Headers");
	// xhttp.send();

	var temp = "Token " + uber_server_token;
	$.ajax({
        url: 'http://127.0.0.1:8080/api/uber/estimates/price',
        type: 'POST',
        dataType: 'json',
        data: { Authorization: temp,
                Content_Type: "application/json",
                Accept_Language: "en_US"
        },
        success: function(json) {
        	alert("success");
        },
        complete: function() {
        	// alert("complete");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
			alert("ERROR: Could not get select stop id start");
		}
    });

}

// function fareEstimates() {
// 	fetch("https://api.uber.com/v1.2/estimates/price?start_latitude=37.312014&start_longitude=-121.952225&end_latitude=37.3844772&end_longitude=-121.93272890000003", {
// 	  headers: {
// 	    "Accept-Language": "en_US",
// 	    "Authorization": "Token " + uber_server_token,
// 	    "Content-Type": "application/json"
// 	  }
// 	});
// }

function loadDoc() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("demo").innerHTML = this.responseText;
		}
	};
	xhttp.open("GET", "https://login.uber.com/oauth/v2/authorize?client_id="+uber_client_id+"&response_type=code", true);
	xhttp.send();

	alert("https://login.uber.com/oauth/v2/authorize?client_id="+uber_client_id+"&response_type=code");
}


function getUberEstimates() {

	/*
	curl -H 'Authorization: Token RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn' \
	     -H 'Accept-Language: en_US' \
	     -H 'Content-Type: application/json' \
	     'https://api.uber.com/v1.2/estimates/price?start_latitude=37.312014&start_longitude=-121.952225&end_latitude=37.3844772&end_longitude=-121.93272890000003'
	*/

	var uber_client_id = "3JajizBicUQTjxJrh8R0iDgt_HUBCJWS";
	var uber_server_token = "RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn";

	var uber_estimates_url = "https://api.uber.com/v1.2/estimates/price?start_latitude="+start_latitude+"&start_longitude="+start_longitude+"&end_latitude="+end_latitude+"&end_longitude="+end_longitude+"&server_token="+uber_server_token;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var JSONObj = JSON.parse(this.responseText);
	        document.getElementById("demo1").innerHTML = JSON.stringify(JSONObj);
	        displayUberEstimates(JSONObj);
	    }
	};
	xmlhttp.open("GET", "uberPrices.json", true);
	xmlhttp.send();

	// var xmlhttp = new XMLHttpRequest();
	// xmlhttp.onreadystatechange = function() {
	//     if (this.readyState == 4 && this.status == 200) {
	//         var JSONObj = JSON.parse(this.responseText);
	//         document.getElementById("demo1").innerHTML = JSON.stringify(JSONObj);
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

function getLyftEstimates() {

	/* curl --include -X GET -H 'Authorization: bearer Uz0CSUD07d/xef+lDlG0nvNa0KkybaHXmdjGZem1OLfxfL0E2PBgwCjEEwRzOsTlEkg8PQ1i43U7l4IHVTSw0hGYEDBXA9uL39rkagTt9beOmbBpwQN0eoA=' \
     'https://api.lyft.com/v1/cost?start_lat=37.312014&start_lng=-121.952225&end_lat=37.3844772&end_lng=-121.93272890000003' */

	var lyft_client_id = "GOVksbfrhvtf";
	var lyft_client_token = "Uz0CSUD07d/xef+lDlG0nvNa0KkybaHXmdjGZem1OLfxfL0E2PBgwCjEEwRzOsTlEkg8PQ1i43U7l4IHVTSw0hGYEDBXA9uL39rkagTt9beOmbBpwQN0eoA=";
	var lyft_client_secret = "ItZ4rCtEeAWnRKqShT-jlCh7I5TLHtUW";

	var lyft_estimates_url = "https://api.lyft.com/v1/cost?start_lat=37.312014&start_lat="+start_latitude+"&start_lng="+start_longitude+"&end_lat="+end_latitude+"&end_lng="+end_longitude;

	// var xhttp = new XMLHttpRequest();
	// xhttp.onreadystatechange = function() {
	// 	if (this.readyState == 4 && this.status == 200) {
	// 		document.getElementById("demo2").innerHTML = this.responseText;
	// 	}
	// };
	// xhttp.open("GET", lyft_estimates_url, true);
	// xhttp.setRequestHeader("Authorization", "bearer " + lyft_client_token);
	// xhttp.send();

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	        var JSONObj = JSON.parse(this.responseText);
	        document.getElementById("demo2").innerHTML = JSON.stringify(JSONObj);
	        displayLyftEstimates(JSONObj);
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