var stompClient = null;

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).message);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

function sendInput() {
    stompClient.send("/app/input", {},
        JSON.stringify({'aowes': $("#arisOwes").val(), 'powes': $("#pitsOwes").val()}));
}

function showGreeting(message) {
    $("#greetings").prepend("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });

    connect();

    $( "#send" ).click(function() { sendInput(); });

    $( "#reset" ).click(function() { reset(); });

    $( "#distance" ).change(function() { calculateGas(); });
    $( "#consumption" ).change(function() { calculateGas(); });
    $( "#price" ).change(function() { calculateGas(); });

    $( "#tolls" ).change(function() { calculateTolls(); });

    $( "#eCalc" ).click(function() { calculateExtra(); });
});

function calculateGas() {
    var distance = $( "#distance" ).val();
    var consumption = $( "#consumption" ).val();
    var price = $( "#price" ).val();
    var result = distance * (consumption / 100) * price;
    $("#gasRes").val(result.toFixed(2));

    calculateTotal();
}

function calculateTolls() {
    var tolls = $( "#tolls" ).val().split("+");
    var result = 0;
    tolls.forEach(function (value) {  result += Number(value)})
    $("#tollsRes").val(result.toFixed(2));

    calculateTotal();
}

function calculateTotal() {
    var tolls = $("#tollsRes").val();
    var gas = $("#gasRes").val();
    $("#total").html((Number(tolls) + Number(gas)).toFixed(2));

    calculatePartial();
}

function calculatePartial() {
    var total = $("#total").html();
    var ap = $("#arisPaid").val();
    var pp = $("#pitsPaid").val();
    var partial = total / 3;
    $("#arisOwes").val((partial - ap).toFixed(2));
    $("#pitsOwes").val((partial - pp).toFixed(2));
}

function calculateExtra(){
    calculatePartial();

    var ao = $("#arisOwes").val();
    var po = $("#pitsOwes").val();

    var jokes = $("#jokes").val();
    if(jokes > 0) {
        po = Number(jokes) + Number(po);
    }

    var skismoke = $("#skismoke").val();
    if(skismoke == 1) {
        ao -= 20;
    }

    var carKeys = $("#carKeys").val();
    if(carKeys == 2) {
        ao -= 5;
        po -= 5;
    }

    var falls = $("#falls").val();
    if(falls > 0) {
        po = Number(po) + Number(0.5*falls);
    }

    $("#arisOwes").val(ao);
    $("#pitsOwes").val(po);
}

function reset() {
    $( "#distance" ).val(380);
    $( "#consumption" ).val(8);
    $( "#price" ).val(1.4);
    $( "#tolls" ).val("3.30+3.85+1.50+3.30");
    $( "#arisPaid" ).val("8.30");
    $( "#pitsPaid" ).val("8.85");

    calculateTolls()
    calculateGas()
}