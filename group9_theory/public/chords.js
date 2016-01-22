var chord_prog = [];
var key;
var meter;
var songTitle;
var curr_chord = undefined;
var ABCg = undefined;

function make_chords_table() {
	chord_prog.length = $("#numchords").val();
	var table_text = "";
	for (var i = 0; i < chord_prog.length; i++) {
		table_text += "<span onclick = 'activate_chord(" + i
								+ ")'>";
		if (chord_prog[i] == undefined) {
			table_text += "Click to choose chord";
		} else {
			table_text += name_of(chord_prog[i]);
		}
		table_text += "</span><br/>";
	}
	document.getElementById("chord").innerHTML = table_text;
}

function activate_chord(index) {
	//TODO: ungrey things and update values in menus.
	curr_chord = index;
}

function generate_clicked(){
	songTitle = $("#songTitle").val();
	var root;
	if($("#key").val() == "A" || $("#key").val() == "Aflat"){
		root = 0;
	}else if ($("#key").val() == "B" || $("#key").val() == "Bflat"){
		root = 1;
	}else if ($("#key").val() == "C" || $("#key").val() == "Csharp"){
		root = 2;
	}else if ($("#key").val() == "D"){
		root = 3;
	}else if ($("#key").val() == "E" || $("#key").val() == "Eflat"){
		root = 4;
	}else if ($("#key").val() == "F" || $("#key").val() == "Fsharp"){
		root = 5;
	}else if ($("#key").val() == "G"){
		root = 6;
	}
	var root_accidental;
	if($("#key").val() == "Aflat" || $("#key").val() == "Bflat" || $("#key").val() == "Eflat"){
		root_accidental = -1;
	}else if($("#key").val() == "Csharp" || $("#key").val() == "Fsharp"){
		root_accidental = 1;
	}else{
		root_accidental = 0;
	}
	
	var mode;
	if ($("#minorkey").is(":checked")){
		mode = "minor";
	}else{
		mode = "major";
	}
	
	key = {"root": root,  "root_accidental": root_accidental, "mode": mode};
	meter = $("#timesig").val();

	//cut the hymn down to size if the user doesn't put enough chords
	for (var i = 0; i < chord_prog.length; i++) {
		if (chord_prog[i] == undefined) {
			chord_prog.length = i;
			break;
		}
	}

	// if there are no chords, alert
	if (chord_prog.length < 1) {
		alert("You cannot generate a song without any chords.");
		return;
	}

	var toSend = 'name=' + 'mingchow' + '&title=' + songTitle + '&key=' +
	JSON.stringify(key) + '&meter=' + meter + 
	'&prog=' + JSON.stringify(chord_prog);
	$.post('http://localhost:3000/writeSong'
		|| 'https://aqueous-castle-9692.herokuapp.com/writeSong',
		toSend, function(response) {
			if (response == 'impossible') {
				alert("There is no valid voice-leading for this chord progression.");
			} else if (response == 'insecure') {
				punishUser();
			} else {
			        ABCg = response;
				ABCJS.renderAbc('outputimage', ABCg);
				if(localStorage.xcount) {
					var temp = Number(localStorage.getItem("xcount"))+1;
					localStorage.setItem("xcount", temp);
				} else {
					localStorage.setItem("xcount", 1);
				}
				var xcount = localStorage.getItem("xcount");
				response = setCharAt(response, 2, xcount);
				if(localStorage.mymusic){
					var temp = localStorage.getItem("mymusic");
					temp = temp + '~~~'+ response;
					localStorage.setItem("mymusic", temp);
				}else{
					localStorage.setItem("mymusic", response);
				}
			}
		});
}

/* function from www.openjs.com/scripts/strings/setcharat_function.php */
function setCharAt(str,index,chr) {
	if(index > str.length-1) return str;
	return str.substr(0,index) + chr + str.substr(index+1);
}

//returns the name of the given chord as a string
function name_of(chord) {
	var name = "";
	switch(chord.root){
		case 0:
		name += "A ";
		break;
		case 1:
		name += "B ";
		break;
		case 2:
		name += "C ";
		break;
		case 3:
		name += "D ";
		break;
		case 4:
		name += "E ";
		break;
		case 5:
		name += "F ";
		break;
		case 6:
		name += "G ";
		break;
	}

	if (chord.root_accidental == -1){
		name += "flat ";
	}else if (chord.root_accidental == 1){
		name += "sharp ";
	}
	
	switch(chord.quality){
		case 'major':
		name += "major ";
		break;
		case 'minor':
		name += "minor ";
		break;
		case 'diminished':
		name += "diminished ";
		break;
		case 'dominant':
		name += "dominant ";
		break;
		case 'halfdiminished':
		name += "halfdiminished ";
		break;
	}
	
	if (chord.seventh){
		name += "seventh ";
	}


	if (chord.inversion == 1){
		name += "1st inversion ";
	}else if (chord.inversion == 2){
		name += "2nd inversion ";
	}else if  (chord.inversion == 3){
		name += "3rd inversion ";
	}

	return name;
}

//Chord implementation goes here and converts box 2 to chords
function submit_clicked(){
	if (($("#quality").val() == 'dominant' ||
		$("#quality").val() == 'halfdiminished') &&
		(!($("#seventh").is(":checked")))) {
		alert("You cannot have a " + $("#quality").val() + " triad.");
		return;
	}

	if (isNaN(parseInt($("#duration").val()))) {
		alert("Please put a duration.");
	}
	
	chord_prog[curr_chord] = {"duration": parseInt($("#duration").val()), "root": parseInt($("#chordroot").val()), "root_accidental": parseInt($("#accidental").val()), "seventh": $("#seventh").is(":checked"), "quality": $("#quality").val(), "inversion": parseInt($("#inversion").val())};

	make_chords_table();
}

function location_example() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
			var toSend = "lat=" + lat + "&lng=" + lng;
			$.get('http://localhost:3000/giveExample'
		   || 'https://aqueous-castle-9692.herokuapp.com/giveExample',
		   toSend, function(response) {
			    if (response == 'impossible') {
					alert("There is no valid voice-leading for this chord progression.");
				} else if (response == 'insecure') {
					punishUser();
			    } else {
					ABCJS.renderAbc('outputimage', response);
			    }
			});
		});
	} else {
		alert("Location is not supported on your browser.");
	}
}

function sendemail() {
    if(ABCg == undefined) {
	alert("You must generate a song before emailing it to yourself!");
    } else {
	var useraddress = $("#email").val();
	// build key-value pair in request.body
	var send = "email="+useraddress+"&ABC="+ABCg;

	var xhr = new XMLHttpRequest();
	var url = "https://aqueous-castle-9692.herokuapp.com/sendEmail";
	xhr.open('POST', url, true);
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
		alert(xhr.responseText);
	    }
	}

	xhr.send(send);
    }
}

function punishUser() {
	var page = document.getElementsByTagName('html')[0];
	page.innerHTML = '<head><meta http-equiv = "refresh" content = "0;/userinput"/></head>';
}
