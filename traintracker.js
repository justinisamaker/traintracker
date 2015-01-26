/* -----------------------------

TRAIN TRACKER
Justin Smith - justin@isamaker.com
@justinIsAMaker

Get the latest time for my train on the Chicago Transit Authority, text it to
me
------------------------------ */

// Require Node libraries
var mraa = require('mraa');
var request = require('request');
var xml2js = require('xml2js');

// Set up parser for xml2js
var parser = new xml2js.Parser();

// CTA vars
var json,
		messageBody,
		loganId = '41020',
		apiKey = '[ INSERT CTA API KEY ]';

//TWILIO
var twilio = require('twilio');
var client = new twilio.RestClient(
	'[ INSERT TWILIO PUBLIC KEY ]',
	'[ INSERT TWILIO PRIVATE KEY ]'
);

// Declare the button
var buttonPin = new mraa.Gpio(2);
buttonPin.dir(mraa.DIR_IN);

console.log('MRAA Version: ' + mraa.getVersion());

function init(){
	getArrTime();
	checkButtonPress();
}

function getArrTime(){
	request(
		'http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=' +
		apiKey +
		'&mapid=' +
		loganId +
		'&max=2', function(error, response, body){
			// PARSE THE XML RESPONSE
			parser.parseString(body, function(err, result){
				json = JSON.stringify(result);
				json = JSON.parse(json);
				return json;
			});

			for(i=0, l=(json['ctatt'].eta).length; i < l; i++){
				// FORMAT THE TIME TO AM/PM
				var arrTime = String(json['ctatt'].eta[i].arrT).slice(9);
				var H = arrTime.slice(0,2);
				var h = (H % 12) || 12;
				var ampm = H < 12 ? "AM" : "PM";
				var formattedArrTime = h + arrTime.substr(2, 3) + ' ' + ampm;

				if((json['ctatt'].eta[i].destNm) == 'Forest Park'){
					messageBody =
											'A Forest Park-Bound ' +
											json['ctatt'].eta[i].rt +
											' Line train will arrive at ' +
											json['ctatt'].eta[i].staNm +
											'at ' +
											formattedArrTime;
					console.log('set: ' + messageBody);
					return messageBody;
				} // END DEST CHECK
			} // END FOR LOOP
	}); // END REQUEST
} // END GET ARRIVAL TIME

function checkButtonPress(){
	var buttonPushed = buttonPin.read();

	if(buttonPushed){
		getArrTime();
		console.log('ret: ' + messageBody);

		client.sms.messages.create({
			to:'[ INSERT TARGET PHONE NUMBER ]',
			from:'+[ INSERT TWILIO PHONE NUMBER ]',
			body: messageBody
		}, function(error, message){
			if(!error){
				console.log(message);
			} else {
				console.log(error);
			}
		});
		setTimeout(function(){
			setTimeout(checkButtonPress, 100);
		}, 2000);
	} else {
	setTimeout(checkButtonPress, 100);
	}
} // END CHECK BUTTON PRESSED

init();
