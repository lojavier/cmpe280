#!/usr/bin/env python
import sys
import json
import cgi, cgitb
cgitb.enable()  # for troubleshooting
from uber_rides.session import Session
from uber_rides.client import UberRidesClient

from flask import Flask

# start_lat = sys.argv[1]
# start_lng = sys.argv[2]
# end_lat = sys.argv[3]
# end_lng = sys.argv[4]

# def index(req):
#     postData = req.form
#     json = str(postData['param'].value)

#the cgi library gets vars from html
# data = cgi.FieldStorage()
# #this is the actual output
# print "Content-Type: text/html\n"
# print "The foo data is: " + data["foo"].value
# print "<br />"
# print "The bar data is: " + data["bar"].value
# print "<br />"
# print data

fs = cgi.FieldStorage()

sys.stdout.write("Content-Type: application/json")

sys.stdout.write("\n")
sys.stdout.write("\n")

session = Session(server_token="RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn")
client = UberRidesClient(session)

result = {}
result['success'] = True
result['message'] = "The command Completed Successfully"
result['keys'] = ",".join(fs.keys())

d = {}
for k in fs.keys():
    d[k] = fs.getvalue(k)

result['data'] = d

sys.stdout.write(json.dumps(result,indent=1))
sys.stdout.write("\n")

sys.stdout.close()


# response = client.get_products(start_lat, start_lng)
# products = response.json.get('products')

# print "PRODUCTS:"
# print products

# response = client.get_price_estimates(
#     start_latitude=start_lat,
#     start_longitude=start_lng,
#     end_latitude=end_lat,
#     end_longitude=end_lng,
#     seat_count=2
# )

# estimate = response.json.get('prices')

# print "ESTIMATE:"
# print estimate