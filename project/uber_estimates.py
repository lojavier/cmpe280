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

@app.route('/get_uber_estimates', methods=['POST'])
def get_uber_estimates():
	start_lat = request.form['pickup_lat']
	start_lng = request.form['pickup_lng']
	end_lat = request.form['dropoff_lat']
	end_lng = request.form['dropoff_lng']
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
	return json.dumps(estimate)

if __name__=="__main__":
	# app.run(ssl_context='adhoc')
    app.run()