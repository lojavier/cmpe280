// $("input:checkbox[name=type]:checked").each(function(){
//     yourArray.push($(this).val());
// });

var activeStep = "sizeCrust";
var sizeCrust = null;
var toppings = [];

function loadCheeseSaucePage()
{
	$('#next-step-area').load('cheeseSauce.html', function() {
		$("#sizeCrust-sep").addClass("seperatorBoth");
		$("#cheeseSauce-btn").addClass("activeStep");
		$("#cheeseSauce-sep").addClass("activeSeperator");
		activeStep = "cheeseSauce";
		setActiveStep();
	});
}

function loadToppingsPage()
{
	$('#next-step-area').load('toppings.html', function() {
		$("#cheeseSauce-sep").addClass("seperatorBoth");
		$("#toppings-btn").addClass("activeStep");
		$("#toppings-end").addClass("rightActiveEndcap");
		activeStep = "toppings";
		setActiveStep();
	});
}

function loadOrderCartPage()
{
	$('#next-step-area').load('orderCart.html', function() {
		activeStep = "orderCart";
		setActiveStep();

		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);
	});
}

// Draw the chart and set the chart values
function drawChart() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
	for(var i = 0; i < toppings.length; i++)
	{
		data.addRows([[toppings[i], 1]]);
	}

	// var data = google.visualization.arrayToDataTable([
	// ['Pizza', 'Cheese+Toppings'],
	// ['Work', 8],
	// ['Eat', 2],
	// ['TV', 4],
	// ['Gym', 2],
	// ['Sleep', 8]
	// ]);

	// Optional; add a title and set the width and height of the chart
	var options = {
		'title':'Your Pizza Stats',
		'width':500, 
		'height':400,
		is3D: true
	};

	// Display the chart inside the <div> element with id="piechart"
	var chart = new google.visualization.PieChart(document.getElementById('piechart'));
	chart.draw(data, options);
}

function setActiveStep()
{
	$('#next-step-btn').off("click");

	if (activeStep == "sizeCrust")
	{
		$('#next-step-btn').click(function(){
			$('input:radio').each(function(){
				if ($(this).is(':checked')) {
					sizeCrust = $(this).val();
					loadCheeseSaucePage();
				}
			});

			if (sizeCrust == null)
			{
				alert('Please select a crust!');
			}
		});
	}
	else if (activeStep == "cheeseSauce")
	{
		$('#next-step-btn').click(function(){
			loadToppingsPage();
		});
	}
	else if (activeStep == "toppings")
	{
		$('#next-step-btn').click(function(){
			$('input:checkbox').each(function(){
				if ($(this).is(':checked')) {
					toppings.push($(this).val());
				}
			});
			loadOrderCartPage();
		});
	}
	else if (activeStep == "orderCart")
	{
		// alert("orderCart");
	}
}

$(document).ready(function(){

	setActiveStep();

});

// $('#selectedTarget').load('includes/contentSnippet.html');