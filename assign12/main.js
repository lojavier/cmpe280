function WebSocketTest()
{
	/*
	if ("WebSocket" in window)
	{
		alert("WebSocket is supported by your Browser!");

		// Let us open a web socket
		// var ws = new WebSocket("ws://localhost:9998/echo");
		var ws = new WebSocket("ws://127.0.0.1:8080/");

		ws.onopen = function()
		{
			// Web Socket is connected, send data using send()
			ws.send("Message to send");
			alert("Message is sent...");
		};

		ws.onmessage = function (evt)
		{ 
			var received_msg = evt.data;
			alert("Message is received...");
			alert(received_msg);
		};

		ws.onclose = function()
		{
			// websocket is closed.
			alert("Connection is closed..."); 
		};

		window.onbeforeunload = function(event) 
		{
			ws.close();
		};
	}
	else
	{
		// The browser doesn't support WebSocket
		alert("WebSocket NOT supported by your Browser!");
	}
	*/


	// var http = require('http');

	// // Options to be used by request 
	// var options = {
	//    host: '127.0.0.1',
	//    port: '8080',
	//    path: '/echo'
	// };

	// // Callback function is used to deal with response
	// var callback = function(response){
	//    // Continuously update stream with data
	//    var body = '';
	//    response.on('data', function(data) {
	//       body += data;
	//    });
	   
	//    response.on('end', function() {
	//       // Data received completely.
	//       console.log(body);
	//    });
	// }
	// // Make a request to the server
	// var req = http.request(options, callback);
	// req.end();

	$.get("http://127.0.0.1:8080/url/here?callback=?", {
	  key: 'value',
	  otherKey: 'otherValue'
	}, function(data){
	    alert("test");
	});

    // $.ajax({
    // 	url: "http://127.0.0.1:8080/test", 
    // 	success: function(result) {
    //         // $("#div1").html(result);
    //         alert(result);
    //     }
    // });
}

$(document).ready(function() {
	$.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://127.0.0.1:8080/',//the problem is here
        async: false,
        data: {},
        success: function(data) {
            alert(data.a+' '+data.b+' '+data.c);
        }
    });

});