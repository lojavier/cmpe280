document.addEventListener("DOMContentLoaded", function() {

	var rectangle = document.getElementById("rectangle");
	var circle = document.getElementById("circle");
	var triangle = document.getElementById("triangle");
	var arrow = document.getElementById("arrow");
	var ctx = "";

	ctx = rectangle.getContext("2d");
	ctx.rect(1, 1, 98, 98);
	ctx.stroke();

	ctx = circle.getContext("2d");
	ctx.beginPath();
	ctx.arc(51, 51, 48, 0, 2 * Math.PI);
	ctx.stroke();

	ctx = triangle.getContext("2d");
	ctx.beginPath();
    ctx.moveTo(48, 0);
    ctx.lineTo(98, 98);
    ctx.lineTo(0, 98);
    ctx.closePath();
    ctx.stroke();

    ctx = arrow.getContext("2d");
	ctx.beginPath();
    ctx.moveTo(1, 35);
    ctx.lineTo(50, 35);
    ctx.lineTo(50, 20);
    ctx.lineTo(98, 49);
    ctx.lineTo(50, 80);
    ctx.lineTo(50, 65);
    ctx.lineTo(1, 65);
    ctx.closePath();
    ctx.stroke();

});

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    // ev.target.appendChild(document.getElementById(data));
    var target = document.getElementById('target');
    var canvas = target.getBoundingClientRect();
    var x = ev.clientX - canvas.left;
    var y = ev.clientY - canvas.top;

	var ctx = target.getContext('2d');

	if(data == "rectangle")
		addRect(ctx, x, y);
	else if(data == "circle")
		addCircle(ctx, x, y);
	else if(data == "triangle")
		addTriangle(ctx, x, y);
	else if(data == "arrow")
		addArrow(ctx, x, y);
}

function ignore(ev) {
    ev.preventDefault();
}

var rectCount = 0;
var circleCount = 0;
var triangleCount = 0;
var arrowCount = 0;

function addRect(ctx, x, y) {
	rectCount++;
	ctx.beginPath();
	ctx.rect(x-50, y-50, 98, 98);
	ctx.closePath();
	ctx.font = "14px Arial";
	ctx.fillText("Rectangle "+rectCount, x-40, y+5);
	ctx.stroke();
}

function addCircle(ctx, x, y) {
	circleCount++;
	ctx.beginPath();
	ctx.arc(x, y, 48, 0, 2 * Math.PI);
	ctx.font = "14px Arial";
	ctx.fillText("Circle "+circleCount, x-25, y+7);
	ctx.stroke();
}

function addTriangle(ctx, x, y) {
	triangleCount++;
	ctx.beginPath();
    ctx.moveTo(x, y-48);
    ctx.lineTo(x+48, y+48);
    ctx.lineTo(x-48, y+48);
    ctx.closePath();
	ctx.font = "14px Arial";
	ctx.fillText("Triangle "+triangleCount, x-35, y+35);
	ctx.stroke();
}

function addArrow(ctx, x, y) {
	arrowCount++;
	ctx.beginPath();
    ctx.moveTo(x-50, y-15);
    ctx.lineTo(x, y-15);
    ctx.lineTo(x, y-30);
    ctx.lineTo(x+50, y);
    ctx.lineTo(x, y+30);
    ctx.lineTo(x, y+15);
    ctx.lineTo(x-50, y+15);
    ctx.closePath();
    ctx.font = "14px Arial";
	ctx.fillText("Arrow "+arrowCount, x-32, y+5);
    ctx.stroke();
}
