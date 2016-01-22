// offer users an example using their location
var location = module.exports = {};

var theory = require('./theory.js');

var lat, lng;
var chord_prog = [];
var key;
var meter;
var songTitle;

location.give_example = function(req_lat, req_lng){
	lat = req_lat;
	lng = req_lng;
	if (lng < -30) {
		if (tufts()) {
			if (halligan()) {
				drunk_in_love();
			} else if (granoff()) {
				get_lucky();
			} else {
				starspangled();
			}
		} else {
			starspangled();
		}
	} else if ((lat > 50) && (lng > 30)) {
		tchaik1812();
	} else if (lat > 55) {
		finlandia();
	} else {
		ode();
	}
	return theory.createSong(songTitle, key, meter, chord_prog);
}

//////// LOCATIONS FUNCTIONS /////

function tufts() {
	return ((lat > 42.401) && (lat < 42.411) && (lng > -71.125) && (lng < -71.113));
}

function granoff() {
	return ((lat > 42.4041) && (lat < 42.4048) && (lng > -71.1187) && (lng < -71.1179));
}

function halligan() {
	return ((lat > 42.4078) && (lat < 42.4092) && (lng > -71.1169) && (lng < -71.1157));
}

//////// EXAMPLES FUNCTIONS /////////

function starspangled() {
	songTitle = "The Star-Spangled Banner";
	key = {root: 1, root_accidental: -1, mode: "major"};
	meter = "3/4";
	chord_prog = [{duration: 1, root: 1, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 1, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 5, root_accidental: 0,
						seventh: false, quality: "major", inversion: 1},
					{duration: 1, root: 6, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 1},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: true, quality: "dominant", inversion: 1},
					{duration: 1, root: 6, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 1, root: 6, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 1, root: 2, root_accidental: 0,
						seventh: true, quality: "dominant", inversion: 0},
					{duration: 3, root: 5, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0}];
}

function ode() {
	songTitle = "Ode to Joy";
	key = {root: 3, root_accidental: 0, mode: "major"};
	meter = "4/4";
	chord_prog = [{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 4, root_accidental: 0,
						seventh: true, quality: "minor", inversion: 3},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 2},
					{duration: 1, root: 0, root_accidental: 0,
						seventh: true, quality: "dominant", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 2},
					{duration: 1, root: 0, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 2},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 2},
					{duration: 1, root: 0, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 2},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 2},
					{duration: 1, root: 0, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 2, root: 0, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0}];
}

function finlandia() {
	songTitle = "Finlandia";
	key = {root: 0, root_accidental: -1, mode: "major"};
	meter = "4/4";
	chord_prog = [{duration: 2, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 2},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: true, quality: "dominant", inversion: 3},
					{duration: 1, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 1},
					{duration: 3, root: 4, root_accidental: -1,
						seventh: true, quality: "dominant", inversion: 2},
					{duration: 1, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: true, quality: "dominant", inversion: 3},
					{duration: 1, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 1},
					{duration: 1, root: 3, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: false, quality: "dominant", inversion: 2},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: false, quality: "dominant", inversion: 2},
					{duration: 3, root: 0, root_accidental: -1,
						seventH: false, quality: "major", inversion: 0}];
}

function tchaik1812() {
	songTitle = "1812 Overture";
	key = {root: 4, root_accidental: -1, mode: "major"};
	meter = "4/4";
	chord_prog = [{duration: 1, root: 4, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 2, root: 1, root_accidental: -1,
						seventh: false, quality: "major", inversion: 1},
					{duration: 2, root: 4, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 1, root_accidental: -1,
						seventh: false, quality: "major", inversion: 1},
					{duration: 1, root: 4, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 4, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0}];
}

function drunk_in_love() {
	songTitle = "Drunk In Love";
	key = {root: 0, root_accidental: -1, mode: "major"};
	meter = "4/4";
	chord_prog = [{duration: 3, root: 5, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 5, root: 1, root_accidental: -1,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 3, root: 4, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 5, root: 0, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0}];
}

function get_lucky() {
	songTitle = "Get Lucky";
	key = {root: 5, root_accidental: 1, mode: "minor"};
	meter = "4/4";
	chord_prog = [{duration: 5, root: 1, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 1, root: 1, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 1, root: 0, root_accidental: 0,
						seventh: false, quality: "major", inversion: 1},
					{duration: 6, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 4, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 6, root: 5, root_accidental: 1,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 1, root: 5, root_accidental: 1,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 1, root: 1, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 2},
					{duration: 7, root: 4, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0}];
}
