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

function displayHighchart()
{
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
    });
}

var gaugeObj = [];
function setGaugeObjects(obj)
{
    gaugeObj = obj;
}

function displayLiquidGauge()
{
    $.get("reservoir_conditions.json", function(JSONObj) {
        var config = liquidFillGaugeDefaultSettings();
        config.circleThickness = 0.15;
        config.waveCount = 2;
        config.waveAnimateTime = 1000;
        config.waveHeight = 0.05;
        config.waveAnimate = true;
        config.waveRise = false;
        config.waveHeightScaling = false;
        config.waveOffset = 0.25;
        config.waveTextColor = "#FFFFFF";

        var rowNum = 0;
        var colNum = 0;
        var maxCol = 4;
        var maxRows = Math.ceil(JSONObj.reservoir_conditions.length / maxCol);
        var gaugeObj = [];

        $(".container-fluid").append("<div class=\"row\" id=\"row-"+rowNum+"\"></div>");

        for (var i = 0; i < JSONObj.reservoir_conditions.length; i++)
        {
            name = JSONObj.reservoir_conditions[i].name;
            percent_capacity = JSONObj.reservoir_conditions[i].percent_capacity;

            $("#row-"+rowNum).append("<div class=\"col-sm-3\" id=\"gauge-col-"+i+"\"></div>")
            $("#gauge-col-"+i).append("<h4>"+name+"</h4>");
            $("#gauge-col-"+i).append("<svg id=\"fill-gauge-"+i+"\" width=\"100%\"></svg>");
            var gauge = loadLiquidFillGauge("fill-gauge-"+i, percent_capacity, config);
            gaugeObj.push(gauge);

            if(colNum < (maxCol-1))
            {
                colNum++;
            }
            else
            {
                colNum = 0;
                rowNum++;
                $(".container-fluid").append("<div class=\"row\" id=\"row-"+rowNum+"\"></div>");
            }
        }

        setGaugeObjects(gaugeObj);
    });
}

function updateLiquidGauge()
{
    $.get("reservoir_conditions.json", function(JSONObj) {
        var config = liquidFillGaugeDefaultSettings();
        config.circleThickness = 0.15;
        config.waveCount = 2;
        config.waveAnimateTime = 1000;
        config.waveHeight = 0.05;
        config.waveAnimate = true;
        config.waveRise = false;
        config.waveHeightScaling = false;
        config.waveOffset = 0.25;
        config.waveTextColor = "#FFFFFF";

        for (var i = 0; i < JSONObj.reservoir_conditions.length; i++)
        {
            percent_capacity = JSONObj.reservoir_conditions[i].percent_capacity;
            gaugeObj[i].update(percent_capacity);
        }
    });
}

$(document).ready(function() {
    displayHighchart();
    displayLiquidGauge();
    setInterval(function(){displayHighchart();updateLiquidGauge();}, 10000);
});
