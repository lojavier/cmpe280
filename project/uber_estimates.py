#!/usr/bin/env python
import os
import sys
import json
from flask import Flask,request,json
from flask_cors import CORS
from uber_rides.session import Session
from uber_rides.client import UberRidesClient

app = Flask(__name__)
CORS(app)

# @app.route('/get_uber_estimates', methods=['POST'])
@app.route('/get_uber_estimates')
def get_uber_estimates():
	print "TEST"
	# start_lat = request.form['pickup_lat']
	# start_lng = request.form['pickup_lng']
	# end_lat = request.form['dropoff_lat']
	# end_lng = request.form['dropoff_lng']
	start_lat = 37.3367761
	start_lng = -121.8785044
	end_lat = 37.3183318
	end_lng = -121.95104909999998
	session = Session(server_token="RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn")
	client = UberRidesClient(session)
	response = client.get_price_estimates(
	    start_latitude=start_lat,
	    start_longitude=start_lng,
	    end_latitude=end_lat,
	    end_longitude=end_lng,
	    seat_count=2
	)
	estimate = response.json.get('prices')
	print estimate
	return json.dumps(estimate)

if __name__=="__main__":
	# app.run(ssl_context='adhoc')
	app.run(host='0.0.0.0',ssl_context='adhoc')
    # app.run()
    # app.run(host='0.0.0.0')