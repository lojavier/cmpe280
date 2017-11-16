function initMap()
{
    $.get("reservoir_conditions.json", function(JSONObj) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 6,
            center: new google.maps.LatLng(37.2293678,-119.50940120000001),
            mapTypeId: 'terrain'
        });

        for (var i = 0; i < JSONObj.reservoir_conditions.length; i++)
        {
            var latitude = JSONObj.reservoir_conditions[i].latitude;
            var longitude = JSONObj.reservoir_conditions[i].longitude;
            var latLng = new google.maps.LatLng(latitude,longitude);
            var marker = new google.maps.Marker({
                position: latLng,
                map: map
            });
        }
    });
}

$(document).ready(function() {
    $.get("reservoir_conditions.json", function(JSONObj) {
        var last_update = JSONObj.last_update;
        var categories = [];
        var max_capacities = [];
        var current_capacities = [];
        var historical_capacities = [];
        for (var i = 0; i < JSONObj.reservoir_conditions.length; i++)
        {
            var max_capacity = JSONObj.reservoir_conditions[i].max_capacity;
            var current_capacity = max_capacity * (JSONObj.reservoir_conditions[i].percent_capacity / 100);
            var historical_capacity = current_capacity * (100 / JSONObj.reservoir_conditions[i].percent_historical_avg);
            categories.push(JSONObj.reservoir_conditions[i].name);
            max_capacities.push(max_capacity);
            current_capacities.push(current_capacity);
            historical_capacities.push(historical_capacity);
        }

        Highcharts.chart('highchart', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Reservoir Conditions'
            },
            subtitle: {
                text: 'Last Update: ' + last_update
            },
            xAxis: {
                categories: categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Capacity (TAF)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} TAF</b></td></tr>',
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
                name: 'Max Capacity',
                data: max_capacities

            }, {
                name: 'Current Capacity',
                data: current_capacities

            }, {
                name: 'Historical Average',
                data: historical_capacities

            }]
        });

        $(".container").append("<div id=\"test\" class=\"row\"></div>");

        for (var i = 0; i < JSONObj.reservoir_conditions.length; i++)
        {
            var max_capacity = JSONObj.reservoir_conditions[i].max_capacity;
            var current_capacity = max_capacity * (JSONObj.reservoir_conditions[i].percent_capacity / 100);
            var historical_capacity = current_capacity * (100 / JSONObj.reservoir_conditions[i].percent_historical_avg);
            categories.push(JSONObj.reservoir_conditions[i].name);
            max_capacities.push(max_capacity);
            current_capacities.push(current_capacity);
            historical_capacities.push(historical_capacity);
        }

        $("#test").append("<h1>TEST</h1>");
    });
});
