//Initalizations
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var path = require('path');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var api = process.env.SENDGRID_APIKEY;
var sendgrid_username   = process.env.SENDGRID_USERNAME;
var sendgrid_password   = process.env.SENDGRID_PASSWORD;

var theory = require('./theory.js');
var location = require('./location.js');

app.get('/', function(req, res) {
	res.sendFile("__dirname" + "/index.html");
});

app.get('/userinput', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/userinput.html'));
});

var chord_prog = [];
var key;
var meter;
var songTitle;

app.post('/writeSong', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	var requestBody = sanitizeChords(req.body);
	if (requestBody != requestBody) {
		res.send('insecure');
	} else {
		songTitle = requestBody.title;
		key = JSON.parse(requestBody.key);
		meter = requestBody.meter;
		chord_prog = JSON.parse(requestBody.prog);

		var ABC = theory.createSong(songTitle,key,meter,chord_prog);
		if (ABC != ABC) {
			res.send("impossible");
		} else {
			res.send(ABC);
		}
	}
});

app.get('/giveExample', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	var requestLatLon = sanitizeLocation(req.query);
	if (requestLatLon != requestLatLon) {
		res.sendFile("__dirname" + "/userinput.html");
	}
	var lat = requestLatLon.lat;
	var lng = requestLatLon.lng;
	ABC = location.give_example(parseFloat(lat), parseFloat(lng));
	if (ABC != ABC) {
		res.send("impossible");
	} else {
		res.send(ABC);
	}
});

app.get('/history', function (req, res) { 
	var tosend = '<!DOCTYPE html>';
	tosend += '<html>';
	tosend += '<head>'
	tosend += '<title>History</title>';
	tosend += '<meta charset="utf-8" />';
	tosend += '<link rel = "stylesheet" href = "history.css">';
	tosend += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>';
	tosend += '<script src="abcjs_basic_2.2-min.js"></script>';
	tosend += '<script>';
	tosend += 'function init_history(){';
	tosend += 'var mus_hist = localStorage.getItem("mymusic");';
	tosend += 'var pattern = /~~~/g;';
	tosend += 'var music_arr = mus_hist.split(pattern);';
	tosend += 'for(var i = 0; i < music_arr.length; i++) {';
	tosend += 'var mydiv = document.createElement("div");';
	tosend += 'var mydivname = "songhistory" + i;';
	tosend += 'mydiv.id = mydivname;';
	tosend += 'song_history.appendChild(mydiv);';
	tosend += 'ABCJS.renderAbc(mydivname, music_arr[i]);} }';
	tosend += '</script>';
	tosend += '</head>';
	tosend += '<body onload="init_history()">';
	tosend += '<div class = "title">';
	tosend += '<h1>History</h1>';
	tosend += '</div>';
	tosend += '<br>';
	tosend += '<div id = "song_history"></div></body></html>';

	res.send(tosend);
});

app.post('/sendEmail', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    var ABC = req.body.ABC;

	var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);

	var email = new sendgrid.Email();

	email.addTo(req.body.email);
	email.setFrom('harmony.generator@gmail.com');

    // adapted from stackoverflow.com/questions/8062399/how-replace-html-br-with-newline-character-n
    var ABCbr = ABC.replace(/\n/ig, "<br>");

	email.setSubject("Output from 4-Voice Harmony Generator");
	email.setHtml('<h3>Here is the ABC output for your chord progression.<h3> <div>'+ ABCbr + '</div><br><br>' + 
		'<h5>To download MIDI or PDF files, visit <a href="http://www.mandolintab.net/abcconverter.php">MandolinTab.net</a> and paste the output into the text box.</h5>');

	sendgrid.send(email, function (err, json) {
		if (err) { return console.error(err); }
	});

	res.send("Congrats! The email was successfully sent!");

});

app.listen(process.env.PORT || 3000);

///////////////// SECURITY //////////////////

function sanitizeChords(userInput) {
	userInput.title = sanitize(userInput.title);
	userInput.key = sanitize(userInput.key);
	userInput.meter = sanitize(userInput.meter);
	userInput.prog = sanitize(userInput.prog);
	if ((userInput.title != userInput.title) ||
		(userInput.key != userInput.key) ||
		(userInput.meter != userInput.meter) ||
		(userInput.prog != userInput.prog)) {
		return NaN;
	} else {
		return userInput;
	}
}

function sanitizeLocation(userInput) {
	userInput.lat = sanitize(userInput.lat);
	userInput.lng = sanitize(userInput.lng);
	if ((userInput.lat != userInput.lat) ||
		(userInput.lng != userInput.lng)) {
		return NaN;
	} else {
		return userInput;
	}
}

function sanitize(userInput) {
	for (var i = 0; i < userInput.length; i++) {
		if ((userInput[i] == '~') || (userInput[i] == '<')) {
			return NaN;
		}
	}
	return userInput;
}
