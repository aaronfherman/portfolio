/*
JavaScript for the theory rules

Estimated base: 1.1 (^4n, always)
Number of add_note_at() calls for sample four-chord hymn: 1,383
Number of add_note_at() calls for sample eight-chord hymn: 5,720
twelve-chord: 44,268

Theory rules that have been implemented:
Do not go outside of a vocal part's range
No non-chord tones
No voice crossing
No overlap
The note in the bass is dependent on the inversion
Do not put adjacent non-bass voices more than an octave apart
No parallel perfect fifths or octaves
No direct fifths or octaves except horn fifths
Prefer to stay in a vocal part's tessitura
Prefer to keep common tones for two different chords
Strongly prefer voice exchange for two similar chords next to each other
Prefer voice exchange for chords 2 apart
Avoid leaps larger than a third in non-bass voices
Avoid leaps larger than a fifth in the bass
Fill in leaps larger than a third in non-bass voices
Do not omit any member of a chord other than the fifth
Do not omit the fifth of a diminished or halfdiminished chord
Prefer not to omit the fifth of any (other) chord
Prefer to double the root in a major/minor triad other than ii6 (including neapolitan!)
Prefer to double the third in those exceptions
Avoid doubling the third in any chord other than the above exceptions
Do not double the seventh in any seventh chord
Do not double the leading tone (in diatonic chords)
Avoid doubling the fifth of a diminished or halfdiminished chord
Always resolve the leading tone in an outer voice (in diatonic chords)
Always approach the seventh of a seventh chord by step or common tone
Always resolve the seventh of a dominant seventh (or fifth of a diminished) downwards
Always resolve the third of a dominant seventh upwards in an outer voice
Prefer to resolve the third of a dominant seventh upwards in an inner voice
Do not move by augmented second
Do not end with the fifth of the chord in the soprano if it ends on a consonant triad
Prefer to end with the root of the chord in the soprano if it ends on a consonant triad

Theory rules that are being implemented:

Theory rules that still need to be implemented:

*/

var theory = module.exports = {};

var chord_prog = [];
var key;
var meter;
var songTitle;

	// TEST IF THIS FUNCTION IS CALLED IN SERVER.JS

	theory.createSong = function(req_songTitle,req_key,req_meter,req_chord_prog){
		songTitle = req_songTitle;
		key = req_key;
		meter = req_meter;
		chord_prog = req_chord_prog;
		return write_hymn();
	}

	var best_hymn;
	var curr_hymn;
	var key_accidentals = new Array(7);
	var beautyArray;

	var ranges = [{max: 23, min: 10}, {max: 27, min: 16},
	{max: 31, min: 20}, {max: 34, min: 23}];

	var tessituras = [{max: 20, min: 11}, {max: 26, min: 21},
	{max: 30, min: 24}, {max: 34, min: 28}];



	function Note() {
	this.pos = undefined; //0 = lowest piano key (A), 23 = middle C
	this.accidental = undefined; //-2 to 2
}

function Note(pos, accidental) {
	this.pos = pos;
	this.accidental = accidental;
}

//voices[0] is bass, voices[1] tenor, voices[2] alto, voices[3] soprano
function BlockChord() {
	this.voices = new Array(4);
	for (var i = 0; i < 4; i++) {
		this.voices[i] = new Note();
	}
	this.duration = undefined;
}

function debug() {
	//FOUR CHORD SAMPLE -- C major -- simple phrase model
/*	key = {root: 2, root_accidental: 0, mode: "major"};
	chord_prog = [{duration: 1, root: 2, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 1},
					{duration: 1, root: 6, root_accidental: 0,
						seventh: true, quality: "dominant", inversion: 0},
					{duration: 1, root: 2, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0}];*/
	//EIGHT CHORD SAMPLE -- F# minor -- circle of fifths
/*	key = {root: 5, root_accidental: 1, mode: "minor"};
	chord_prog = [{duration: 1, root: 5, root_accidental: 1,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 2, root: 1, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 1},
					{duration: 1, root: 4, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 2, root: 0, root_accidental: 0,
						seventh: false, quality: "major", inversion: 1},
					{duration: 1, root: 3, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 2, root: 6, root_accidental: 0,
						seventh: false, quality: "major", inversion: 1},
					{duration: 1, root: 2, root_accidental: 1,
						seventh: true, quality: "dominant", inversion: 0},
					{duration: 2, root: 5, root_accidental: 1,
						seventh: false, quality: "minor", inversion: 0}];*/
	//SAMPLE #3 -- 12 chords -- Eb major -- descending thirds
	key = {root: 4, root_accidental: -1, mode: "major"};
	chord_prog = [{duration: 2, root: 4, root_accidental: -1,
					seventh: false, quality: "major", inversion: 0},
				{duration: 1, root: 6, root_accidental: 0,
					seventh: true, quality: "dominant", inversion: 2},
				{duration: 2, root: 2, root_accidental: 0,
					seventh: false, quality: "minor", inversion: 0},
				{duration: 1, root: 4, root_accidental: -1,
					seventh: true, quality: "dominant", inversion: 2},
				{duration: 2, root: 0, root_accidental: -1,
					seventh: false, quality: "major", inversion: 0},
				{duration: 1, root: 2, root_accidental: 0,
					seventh: true, quality: "dominant", inversion: 2},
				{duration: 2, root: 5, root_accidental: 0,
					seventh: false, quality: "minor", inversion: 0},
				{duration: 1, root: 5, root_accidental: 0,
					seventh: true, quality: "minor", inversion: 1},
				{duration: 1, root: 4, root_accidental: -1,
					seventh: false, quality: "major", inversion: 2},
				{duration: 1, root: 1, root_accidental: -1,
					seventh: false, quality: "major", inversion: 0},
				{duration: 1, root: 1, root_accidental: -1,
					seventh: true, quality: "dominant", inversion: 0},
				{duration: 3, root: 4, root_accidental: -1,
					seventh: false, quality: "major", inversion: 0}];
	//The Star Spangled Banner
/*	key = {root: 1, root_accidental: -1, mode: "major"};
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
						seventh: false, quality: "major", inversion: 0}];*/
	//Vanessa's Hymn
/*	key = {root: 5, root_accidental: 0, mode: "minor"};
	chord_prog = [{duration: 2, root: 5, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 2, root: 1, root_accidental: -1,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 2, root: 3, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 2, root: 4, root_accidental: 0,
						seventh: true, quality: "diminished", inversion: 0},
					{duration: 2, root: 2, root_accidental: 0,
						seventh: true, quality: "dominant", inversion: 1},
					{duration: 2, root: 5, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0},
					{duration: 2, root: 2, root_accidental: 0,
						seventh: false, quality: "major", inversion: 0},
					{duration: 2, root: 3, root_accidental: -1,
						seventh: false, quality: "major", inversion: 0},
					{duration: 2, root: 6, root_accidental: 0,
						seventh: false, quality: "diminished", inversion: 0},
					{duration: 2, root: 5, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 2},
					{duration: 2, root: 2, root_accidental: 0,
						seventh: true, quality: "dominant", inversion: 0},
					{duration: 2, root: 5, root_accidental: 0,
						seventh: false, quality: "minor", inversion: 0}];*/
	write_hymn();
}


function write_hymn(){

	// write out the correct accidentals for each note in key_accidentals
	set_key_accidentals();

	//set up an empty hymn in curr_hymn
	var chord_array = new Array();
	var i = 0;
	while (i < chord_prog.length) {
		chord_array.push(new BlockChord());
		chord_array[i].duration = chord_prog[i].duration;
		i++;
	}
	curr_hymn = {chords: chord_array, beauty: 0};

	//set up a beauty optimization table in beautyArray
	makeBeautyArray();

	//write the hymn recursively
	add_note_at(0, 0);

	return convert();
}


function set_key_accidentals() {
	var curr_note = key.root;
	var last;
	var isMajorKey = (key.mode == "major");
	for (var i = 0; i < 7; i++) {
		if (i == 0) {
			key_accidentals[curr_note] = key.root_accidental;
		} else if ((i == 1) || (i == 4) || (i == 6)) {
			key_accidentals[curr_note] =
			secondAccidental(last, key_accidentals[last], true);
		} else if ((i == 2) || (i == 5)) {
			key_accidentals[curr_note] =
			secondAccidental(last, key_accidentals[last], isMajorKey);
		} else { //if i == 3
			key_accidentals[curr_note] =
			secondAccidental(last, key_accidentals[last], !isMajorKey);
		}
		last = curr_note;
		curr_note = (curr_note + 1) % 7;
	}
}

function makeBeautyArray() {
	var i, j;
	beautyArray = new Array(chord_prog.length);
	for (i = 0; i < chord_prog.length; i++) {
		beautyArray[i] = new Array(4);
		for (j = 0; j < 4; j++) {
			beautyArray[i][j] = 0;
		}
	}

	//take common tones into account
	var numTones;
	for (i = 1; i < chord_prog.length; i++) {
		numTones = numCommonTones(i, i - 1)
					+ !(chord_prog[i].seventh || chord_prog[i - 1].seventh) // doubling without consequences
					- isSameIn(bassOf(i), bassOf(i - 1), i, i - 1); // don't count the bass
					for (j = 3; numTones > 0; j--) {
						beautyArray[i][j]++;
						numTones--;
					}
				}

	//also voice exchange
	for (i = 1; i < chord_prog.length; i++) {
		if (isSimilar(i, i - 1)) {
			beautyArray[i][3] += 2 - (chord_prog[i].inversion == chord_prog[i - 1].inversion);
		}
	}
	for (i = 2; i < chord_prog.length; i++) {
		if ((numCommonTones(i, i - 2) > 1) &&
			(!isSimilar(i, i - 1) && (!isSimilar(i - 1, i - 2)))) {
			if (isSimilar(i, i - 2) &&
				(chord_prog[i].inversion != chord_prog[i - 1].inversion)) {
				beautyArray[i][3] += 2;
		} else {
			beautyArray[i][3] += 1;
		}
	}
}

	//also membership
	for (i = 0; i < chord_prog.length; i++) {
		beautyArray[i][3] += 2 - chord_prog[i].seventh;
	}
	//also ending on the tonic
	beautyArray[chord_prog.length - 1][3] +=
	!chord_prog[chord_prog.length - 1].seventh;
}

//try writing a note at a specific location in the hymn
function add_note_at(chord_i, voice_i) {

if (isBeautifulEnough(chord_i, voice_i)) {

		//initialize to the highest note this voice part can sing
		var curr_note = new Note(ranges[voice_i].max, 0);
		var beautyEffect;

		//loop through each of the notes within the singer's range
		while(curr_note.pos >= ranges[voice_i].min) {
			if (isInChord(curr_note.pos, chord_i, voice_i)) {
				curr_note.accidental = rightAccidental(curr_note.pos, chord_i);
				if (followsRules(curr_note, chord_i, voice_i)) {
					beautyEffect = beautyEffectOf(curr_note, chord_i, voice_i);
					noteAt(chord_i, voice_i).pos = curr_note.pos;
					noteAt(chord_i, voice_i).accidental = curr_note.accidental;
					curr_hymn.beauty += beautyEffect;
					if (voice_i == 3) { //if we're at the soprano
						//if we're at the last chord
					if (chord_i + 1 == curr_hymn.chords.length) {
						if ((best_hymn == undefined) ||
							(best_hymn.beauty < curr_hymn.beauty)) {
							replace_hymn();
					}
						} else { //if we have more chords to voice
							add_note_at(chord_i + 1, 0);
						}
					} else { //if we have to finish this chord
						add_note_at(chord_i, voice_i + 1);
					}
					curr_hymn.beauty -= beautyEffect;
				}
			}
			curr_note.pos--; //if the note isn't in the chord, try another
		}
	}
}

//make a deep copy of curr_hymn in best_hymn
function replace_hymn() {
	var i, j;
	if (best_hymn == undefined) {
		//set up an empty hymn in curr_hymn
		var chord_array = new Array();
		i = 0;
		while (i < chord_prog.length) {
			chord_array.push(new BlockChord());
			chord_array[i].duration = chord_prog[i].duration;
			i++;
		}
		best_hymn = {chords: chord_array, beauty: undefined};
	}
	best_hymn.beauty = curr_hymn.beauty;
	for (i = 0; i < best_hymn.chords.length; i++) {
		for (j = 0; j < 4; j++) {
			best_hymn.chords[i].voices[j].pos = curr_hymn.chords[i].voices[j].pos;
			best_hymn.chords[i].voices[j].accidental =
			curr_hymn.chords[i].voices[j].accidental;
		}
	}
}

/////////////////// PICKING NOTES TO TEST ///////////////////

//returns true if there could be a solution stemming from this chord
//that is the most beautiful
function isBeautifulEnough(chord_i, voice_i) {
	if (best_hymn == undefined) {
		return true;
	}
	var potential = curr_hymn.beauty;
	for (var i = chord_i; i < chord_prog.length; i++) {
		for (var j = 0; j < 4; j++) {
			if (!((i == chord_i) && (j < voice_i))) {
				potential += beautyArray[i][j];
			}
		}
	}
	return (potential > best_hymn.beauty);
}

function isInChord(note_pos, chord_i, voice_i) {
	if (voice_i > 0) {
		return ((note_pos % 7 == rootOf(chord_i)) ||
			(note_pos % 7 == thirdOf(chord_i)) ||
			(note_pos % 7 == fifthOf(chord_i)) ||
			(chord_prog[chord_i].seventh
				&& (note_pos % 7 == seventhOf(chord_i))));
	} else {
		if (chord_prog[chord_i].inversion == 0) {
			return (note_pos % 7 == rootOf(chord_i));
		} else if (chord_prog[chord_i].inversion == 1) {
			return (note_pos % 7 == thirdOf(chord_i));
		} else if (chord_prog[chord_i].inversion == 2) {
			return (note_pos % 7 == fifthOf(chord_i));
		} else {
			return (note_pos % 7 == seventhOf(chord_i));
		}
	}
}

function rightAccidental(note_pos, chord_i) {
	var root_here = chord_prog[chord_i].root;
	var root_acc_here = chord_prog[chord_i].root_accidental;
	var quality_here = chord_prog[chord_i].quality;
	if (note_pos % 7 == root_here % 7) {
		return root_acc_here;
	} else if (note_pos % 7 == (root_here + 2) % 7) {
		if ((quality_here == "major") || (quality_here == "dominant")) {
			if ((root_here == 2) || (root_here == 5) || (root_here == 6)) {
				return root_acc_here;
			} else {
				return root_acc_here + 1;
			}
		} else {
			if ((root_here == 2) || (root_here == 5) || (root_here == 6)) {
				return root_acc_here - 1;
			} else {
				return root_acc_here;
			}
		}
	} else if (note_pos % 7 == (root_here + 4) % 7) {
		if ((quality_here == "diminished") || (quality_here == "halfdiminished")) {
			if (root_here == 1) {
				return root_acc_here;
			} else {
				return root_acc_here - 1;
			}
		} else {
			if (root_here == 1) {
				return root_acc_here + 1;
			} else {
				return root_acc_here;
			}
		}
	} else {
		if (quality_here == "major") {
			if ((root_here == 2) || (root_here == 5)) {
				return root_acc_here;
			} else {
				return root_acc_here + 1;
			}
		} else if (quality_here == "diminished") {
			if ((root_here == 2) || (root_here == 5)) {
				return root_acc_here - 2;
			} else {
				return root_acc_here - 1;
			}
		} else {
			if ((root_here == 2) || (root_here == 5)) {
				return root_acc_here - 1;
			} else {
				return root_acc_here;
			}
		}
	}
}

/////////////////// HARD FAST RULES ///////////////////

function followsRules(note, chord_i, voice_i) {
	//rules for one chord
	if  (isVoiceCrossing(note, chord_i, voice_i) ||
		isVoiceOverlap(note, chord_i, voice_i) ||
		(!isGoodSpacing(note, chord_i, voice_i)) ||
		makesParallel(note, chord_i, voice_i) ||
		impossibleLeap(note, chord_i, voice_i) ||
		(!fillsInLeaps(note, chord_i, voice_i)) ||
		doublesSeventh(note, chord_i, voice_i) ||
		doublesLeadingTone(note, chord_i, voice_i) ||
		(!resolvesLeadingTone(note, chord_i, voice_i)) ||
		(!preparesSeventh(note, chord_i, voice_i)) ||
		(!resolvesTritoneDown(note, chord_i, voice_i)) ||
		(!resolvesTritoneUp(note, chord_i, voice_i)) ||
		(movesByAugmentedSecond(note, chord_i, voice_i))) {
		return false;
}
if (voice_i == 3) {
	if ((!makesCompleteChord(note, chord_i)) ||
		endsOnFifth(note, chord_i)) {
		return false;
}
}
return true;
}

function debugFollowsRules(note, chord_i, voice_i) {
	if (isVoiceCrossing(note, chord_i, voice_i)) {
		console.log("voice crossing");
	} else if (isVoiceOverlap(note, chord_i, voice_i)) {
		console.log("voice overlap");
	} else if (!isGoodSpacing(note, chord_i, voice_i)) {
		console.log("bad spacing");
	} else if (makesParallel(note, chord_i, voice_i)) {
		console.log("makes a parallel");
	} else if (impossibleLeap(note, chord_i, voice_i)) {
		console.log("craycray leap");
	} else if (!fillsInLeaps(note, chord_i, voice_i)) {
		console.log("doesnt fill in a leap");
	} else if (doublesSeventh(note, chord_i, voice_i)) {
		console.log("doubles the seventh");
	} else if (doublesLeadingTone(note, chord_i, voice_i)) {
		console.log("doubles the leading tone");
	} else if (!resolvesLeadingTone(note, chord_i, voice_i)) {
		console.log("does not resolve the leading tone");
	} else if (!preparesSeventh(note, chord_i, voice_i)) {
		console.log("does not prepare the seventh");
	} else if (!resolvesTritoneDown(note, chord_i, voice_i)) {
		console.log("does not resolve the tritone (down)");
	} else if (!resolvesTritoneUp(note, chord_i, voice_i)) {
		console.log("does not resolve the tritone (up)");
	} else if (movesByAugmentedSecond(note, chord_i, voice_i)) {
		console.log("moves by augmented second");
	} else if ((voice_i == 3) && (!makesCompleteChord(note, chord_i))) {
		console.log("makes incomplete chord");
	}
}

function isVoiceCrossing(note, chord_i, voice_i) {

	var prev = noteAt(chord_i, voice_i - 1);
	return ((voice_i > 0) &&
		((note.pos < prev.pos) ||
			((note.pos == prev.pos) && (note.accidental < prev.accidental))));
}

function isVoiceOverlap(note, chord_i, voice_i) {
	if (chord_i < 1)
		return false;
	if (voice_i > 0) {
		var prev_below = noteAt(chord_i - 1, voice_i - 1);
		if ((note.pos < prev_below.pos) ||
			((note.pos == prev_below.pos) &&
				(note.accidental < prev_below.accidental))) {
			return true;
	}
}
if (voice_i < 3) {
	var prev_above = noteAt(chord_i - 1, voice_i + 1);
	if ((note.pos > prev_above.pos) ||
		((note.pos == prev_above.pos) &&
			(note.accidental > prev_above.accidental))) {
		return true;
}
}
return false;
}

function isGoodSpacing(note, chord_i, voice_i) {
	return ((voice_i < 2) ||
		(note.pos <= noteAt(chord_i, voice_i - 1).pos + 7));
}

function makesParallel(note, chord_i, voice_i) {

	//if this is the bass or the first chord (so we can't tell yet)
	if ((chord_i == 0) || (voice_i == 0)) {
		return false;
	}

										//otherwise,
	for (var i = 0; i < voice_i; i++) { //for every voice below this voice
		if (areParallel(note, chord_i, voice_i, i)) { //check for parallels
			return true;
		}
	}
	return false;
}

//helper for makesParallel
//assumes that v1 is at least 1
//TODO: This could be made shorter.
function areParallel(note, chord_i, v1, v2) {
	var note2 = noteAt(chord_i, v2);
	var prev = noteAt(chord_i - 1, v1);
	var prev2 = noteAt(chord_i - 1, v2);
	if (areSame(note, prev) || areSame(note2, prev2)) {
		return false;
	}
	if (((note.pos - note2.pos) % 7 == 0) &&
		(isPerfectOctave(note, note2))) {
		if ((note.pos - note2.pos == prev.pos - prev2.pos) &&
			(isPerfectOctave(prev, prev2))) {
			return true; //parallel octaves
	} else if (((note.pos - prev.pos > 0) &&
		(note2.pos - prev2.pos > 0)) ||
	((note.pos - prev.pos < 0) &&
		(note2.pos - prev2.pos < 0))) {
			return true; //direct octaves
		}
	}
	if (((note.pos - note2.pos) % 7 == 4) &&
		(isPerfectFifth(note, note2))) {
		if ((note.pos - note2.pos == prev.pos - prev2.pos) &&
			(isPerfectFifth(prev, prev2))) {
			return true; //parallel fifths
	} else if ((note.pos - prev.pos < 2) && (note.pos - prev.pos > -2)) {
			return false; //horn fifths
		} else if (((note.pos - prev.pos > 0) &&
			(note2.pos - prev2.pos > 0)) ||
		((note.pos - prev.pos < 0) &&
			(note2.pos - prev2.pos < 0))) {
			return true; //direct fifths
		}
	}
	return false;
}

//returns true if and only if a leap cannot be filled in over the course
//of the remainder of the hymn
function impossibleLeap(note, chord_i, voice_i) {
	if ((chord_i == 0) || (voice_i == 0)) {
		return false;
	}
	var leapSize = spaceBetween(note, noteAt(chord_i - 1, voice_i));
	if (leapSize < 3) { //if the leap is less than a fourth
		return false;
	}
	if (leapSize > (curr_hymn.chords.length - chord_i)) {
		return true;
	}
	return false;
}

function fillsInLeaps(note, chord_i, voice_i) {
	if ((chord_i < 2) || (voice_i == 0)) {
		return true;
	}

	//find the most recent big leap
	var leapEnd, i, leapSize;
	for (i == chord_i - 1; (i > 0) && (old == undefined); i--) {
		leapSize = spaceBetween(noteAt(i - 1, voice_i), noteAt(i, voice_i))
		if (leapSize > 2) {
			leapEnd = i;
		}
	}
	if ((leapEnd == undefined) || (!isInShadow(leapSize, leapEnd, chord_i, voice_i))) {
		return true;
	}
	var leap = noteAt(leapEnd, voice_i).pos - noteAt(leapEnd - 1, voice_i).pos;
	var prev = noteAt(chord_i - 1, voice_i);
	if (note.pos == prev.pos + 1) {
		return (leap < 0);
	} else if (note.pos == prev.pos - 1) {
		return (leap > 0);
	} else if (note.pos == prev.pos) {
		return true;
	} else {
		return false;
	}
}

function isInShadow(leapSize, leapEnd, chord_i, voice_i) {
	//check for common tones
	for (var i = leapEnd + 1; i < chord_i; i++) {
		if (noteAt(i, voice_i).pos == noteAt(i - 1, voice_i).pos) {
			leapSize++; //raise the threshold from the leap size
		}
	}

	return (leapSize <= chord_i - leapEnd);
}

function makesCompleteChord(note, chord_i) {
	var hasRoot, hasThird, hasFifth, hasSeventh, i, curr_letter;
	hasRoot = false;
	hasThird = false;
	hasFifth = false;
	hasSeventh = false;
	for (var i = 0; i < 4; i++) {
		if (i == 3) {
			curr_letter = note.pos % 7;
		} else {
			curr_letter = noteAt(chord_i, i).pos % 7;
		}
		if (curr_letter == rootOf(chord_i)) {
			hasRoot = true;
		} else if (curr_letter == thirdOf(chord_i)) {
			hasThird = true;
		} else if (curr_letter == fifthOf(chord_i)) {
			hasFifth = true;
		} else if (chord_prog[chord_i].seventh &&
			(curr_letter == seventhOf(chord_i))) {
			hasSeventh = true;
		}
	}
	return (hasRoot && hasThird &&
		((!chord_prog[chord_i].seventh) || hasSeventh) &&
		((!((chord_prog[chord_i].quality == "diminished") ||
			(chord_prog[chord_i].quality == "halfdiminished"))) || hasFifth));
}

function doublesSeventh(note, chord_i, voice_i) {
	if ((!chord_prog[chord_i].seventh) || (voice_i < 1) ||
		(note.pos % 7 != seventhOf(chord_i))) {
		return false;
}
for (var i = 0; i < voice_i; i++) {
	if (noteAt(chord_i, i).pos % 7 == seventhOf(chord_i)) {
		return true;
	}
}
return false;
}

function doublesLeadingTone(note, chord_i, voice_i) {
	//if the note isn't a leading tone, the leading tone isn't in the chord,
	//or the note is the seventh, OR the chord isn't diatonic
	if ((voice_i < 1) ||
		(!isLeadingTone(note)) ||
		(!isInChord(key.root + 6, chord_i, 1)) ||
		(!isDiatonic(chord_i)) ||
		((chord_prog[chord_i].seventh) &&
			(note.pos % 7 == seventhOf(chord_i)))) {
		return false;
}
for (var i = 0; i < voice_i; i++) {
	if (isLeadingTone(noteAt(chord_i, i))) {
		return true;
	}
}
return false;
}

function resolvesLeadingTone(note, chord_i, voice_i) {
	// if we're not in an outer voice of a diatonic chord
	if (((voice_i > 0) && (voice_i < 3)) || (!isDiatonic(chord_i))) {
		return true;
	}
	//if this IS a leading tone
	if (isLeadingTone(note)) {
		//if there is not room to resolve the leading tone
		if (chord_i + 1 >= chord_prog.length) {
			return false;
		//if the leading tone is common or can be resolved up or can be common
	} else if (((chord_i > 0) && (note.pos == noteAt(chord_i - 1, voice_i).pos)) ||
		isInChord(note.pos + 1, chord_i + 1, voice_i) ||
		isInChord(note.pos, chord_i + 1, voice_i)) {
		return true;
		//if the leading tone can be resolved down
	} else if ((chord_i + 2 < chord_prog.length) &&
		isInChord(note.pos - 1, chord_i + 1, voice_i) &&
		isInChord(note.pos - 2, chord_i + 2, voice_i)) {
		return true;
	} else {
		return false;
	}
	//if this is one note after the most recent leading tone
} else if ((chord_i > 0) && isLeadingTone(noteAt(chord_i - 1, voice_i))) {
		//if it resolves it up
		if (noteAt(chord_i - 1, voice_i).pos + 1 == note.pos) {
			return true;
		//if it is in the process of resolving it down
	} else if ((noteAt(chord_i - 1, voice_i).pos - 1 == note.pos) &&
		(chord_i + 1 < chord_prog.length) &&
		(isInChord(note.pos - 1, chord_i + 1, voice_i))) {
		return true;
	} else {
		return false;
	}
	//if this is two notes after the most recent leading tone
} else if ((chord_i > 1) && isLeadingTone(noteAt(chord_i - 2, voice_i))) {
		//if that leading tone has already been resolved up
		if (noteAt(chord_i - 2, voice_i).pos + 1 ==
			noteAt(chord_i - 1, voice_i).pos) {
			return true;
		//assuming it's been partially resolved down, are we completing
		//the process now?
	} else if (noteAt(chord_i - 2, voice_i).pos - 2 == note.pos) {
		return true;
	} else {
		return false;
	}
	//if this is nowhere near a leading tone in this voice
} else {
	return true;
}
}

function preparesSeventh(note, chord_i, voice_i) {
	if ((chord_i == 0) || (voice_i == 0) || (!chord_prog[chord_i].seventh) ||
		(note.pos % 7 != (seventhOf(chord_i)))) {
		return true;
} else {
	var prev = noteAt(chord_i - 1, voice_i);
	return ((prev.pos <= note.pos + 1) &&
		(prev.pos >= note.pos - 1));
}
}

function resolvesTritoneDown(note, chord_i, voice_i) {
	if (chord_i == 0) {
		return true;
	} else if (((chord_prog[chord_i - 1].quality == "dominant") &&
		(noteAt(chord_i - 1, voice_i).pos % 7 == seventhOf(chord_i - 1))) ||
	(((chord_prog[chord_i - 1].quality == "diminished") ||
		(chord_prog[chord_i - 1].quality == "halfdiminished")) &&
	(noteAt(chord_i - 1, voice_i).pos % 7 == fifthOf(chord_i - 1)))) {
		return ((note.pos == noteAt(chord_i - 1, voice_i).pos) ||
			(note.pos == noteAt(chord_i - 1, voice_i).pos - 1));
	} else {
		return true;
	}
}

function resolvesTritoneUp(note, chord_i, voice_i) {
	if ((chord_i == 0) || (voice_i == 1) || (voice_i == 2)) {
		return true;
	} else if ((chord_prog[chord_i - 1].quality == "dominant") &&
		(noteAt(chord_i - 1, voice_i).pos % 7 == thirdOf(chord_i - 1))) {
		return ((note.pos == noteAt(chord_i - 1, voice_i).pos) ||
			(note.pos == noteAt(chord_i - 1, voice_i).pos + 1));
	} else {
		return true;
	}
}

function movesByAugmentedSecond(note, chord_i, voice_i) {
	if ((chord_i == 0) || (voice_i == 0)) {
		return false;
	} else if (note.pos - noteAt(chord_i - 1, voice_i).pos == 1) {
		return (isAugmentedSecond(note, noteAt(chord_i, voice_i)));
	} else if (note.pos - noteAt(chord_i - 1, voice_i).pos == -1) {
		return (isAugmentedSecond(noteAt(chord_i, voice_i), note));
	} else {
		return false;
	}
}

function endsOnFifth(note, chord_i) {
	return ((chord_i + 1 == chord_prog.length) &&
		(!chord_prog[chord_i].seventh) &&
		(!chord_prog[chord_i].quality == "diminished") &&
		(note.pos % 7 == fifthOf(chord_i)));
}

/////////////////// GUIDELINES ///////////////////

function beautyEffectOf(note, chord_i, voice_i) {
	var beautyEffect = 0;
	beautyEffect -= !isInTessitura(note, voice_i);
	beautyEffect += isCommonTone(note, chord_i, voice_i);
	beautyEffect += voiceExchangeBonus(note, chord_i, voice_i);
	beautyEffect -= leapPenalty(note, chord_i, voice_i);
	beautyEffect -= !resolvesTritoneUpInner(note, chord_i, voice_i);
	if (voice_i == 3) {
		if (hasFifth(note, chord_i)) {
			beautyEffect++;
		}
		if (endsOnRoot(note, chord_i)) {
			beautyEffect++;
		}
		beautyEffect += doublingBonus(note, chord_i);
	}
	return beautyEffect;
}

function isInTessitura(note, voice_i) {
	return ((note.pos <= tessituras[voice_i].max) &&
		(note.pos >= tessituras[voice_i].min));
}

function isCommonTone(note, chord_i, voice_i) {
	if ((chord_i < 1) || (voice_i < 1)) {
		return false;
	}
	if (areSame(note, noteAt(chord_i - 1, voice_i))) {
		return true;
	}
	return false;
}

function voiceExchangeBonus(note, chord_i, voice_i) {
	if ((chord_i < 1) || (voice_i < 1)) {
		return 0;
	} else if (isSimilar(chord_i, chord_i - 1)) {
		if (isVoiceExchange(note, chord_i, chord_i - 1, voice_i)) {
			return 3;
		} else {
			return 0;
		}
	} else if (chord_i > 1) {
		if (isVoiceExchange(note, chord_i, chord_i - 2, voice_i)) {
			return 1;
		} else {
			return 0;
		}
	} else {
		return 0;
	}
}

function isVoiceExchange(note, newchord, oldchord, voice_i) {
	if (note.pos % 7 == noteAt(oldchord, voice_i).pos % 7) {
		return false;
	}
	for (var i = 0; i < voice_i; i++) {
		if ((note.pos % 7 == noteAt(oldchord, i).pos % 7) &&
			(noteAt(newchord, i).pos % 7 == noteAt(oldchord, voice_i).pos % 7)) {
			return true;
	}
}
return false;
}

function leapPenalty(note, chord_i, voice_i) {
	if (chord_i == 0) {
		return 0;
	}
	var leapSize = spaceBetween(note, noteAt(chord_i - 1, voice_i));
	if (voice_i == 0) {
		leapSize -= 4;
	} else {
		leapSize -= 2;
	}
	if (leapSize < 0) {
		return 0;
	} else {
		return leapSize;
	}
}

function hasFifth(note, chord_i) {
	var i, curr_letter;
	for (i = 0; i < 4; i++) {
		if (i == 3) {
			curr_letter = note.pos % 7;
		} else {
			curr_letter = noteAt(chord_i, i).pos % 7;
		}
		if (curr_letter == fifthOf(chord_i)) {
			return true;
		}
	}
	return false;
}

function doublingBonus(note, chord_i) {
	var numRoots = 0;
	var numThirds = 0;
	var numFifths = 0;
	var i, curr_letter;
	for (i = 0; i < 4; i++) {
		if (i == 3) {
			curr_letter = note.pos % 7;
		} else {
			curr_letter = noteAt(chord_i, i).pos % 7;
		}
		if (curr_letter == rootOf(chord_i)) {
			numRoots++;
		} else if (curr_letter == thirdOf(chord_i)) {
			numThirds++;
		} else if (curr_letter == fifthOf(chord_i)) {
			numFifths++;
		}
	}
	var bonus = 0;
	if (isII6(chord_i) && (numThirds > 1)) {
		bonus++;
	} else {
		if (numThirds > 1) {
			bonus--;
		}
		if ((!chord_prog[chord_i].seventh) &&
			(chord_prog[chord_i].quality != "diminished") &&
			(numRoots > 1)) {
			bonus++;
	}
}
if (((chord_prog[chord_i].quality == "diminished") ||
	(chord_prog[chord_i].quality == "halfdiminished")) &&
	(numFifths > 1)) {
	bonus--;
}
return bonus;
}

function resolvesTritoneUpInner(note, chord_i, voice_i) {
	if ((chord_i == 0) || (voice_i == 0) || (voice_i == 3)) {
		return true;
	} else if ((chord_prog[chord_i - 1].quality == "dominant") &&
		(noteAt(chord_i - 1, voice_i).pos % 7 == thirdOf(chord_i - 1))) {
		return (note.pos == noteAt(chord_i - 1, voice_i).pos + 1);
	} else {
		return true;
	}
}

function endsOnRoot(note, chord_i) {
	return ((chord_i + 1 == chord_prog.length) &&
		(!chord_prog[chord_i].seventh) &&
		(!chord_prog[chord_i].quality == "diminished") &&
		(note.pos % 7 == rootOf(chord_i)));
}

////////////////////////////////////////////////////////////////
/////////////////// GENERAL HELPER FUNCTIONS ///////////////////
////////////////////////////////////////////////////////////////

function noteAt(chord_i, voice_i) {
	return curr_hymn.chords[chord_i].voices[voice_i];
}

function areSame(note1, note2) {
	return ((note1.pos == note2.pos) &&
		(note1.accidental == note2.accidental));
}

function isInKey(note) {
	return (note.accidental == key_accidentals[note.pos % 7]);
}

function isLeadingTone(note) {
	if (!((note.pos + 1) % 7 == key.root)) {
		return false;
	}
	if ((key.root == 2) || (key.root == 5)) {
		return (key.root_accidental == note.accidental);
	} else {
		return (key.root_accidental == note.accidental - 1);
	}
}

function rootOf(chord_i) {
	return chord_prog[chord_i].root;
}

function thirdOf(chord_i) {
	return (chord_prog[chord_i].root + 2) % 7;
}

function fifthOf(chord_i) {
	return (chord_prog[chord_i].root + 4) % 7;
}

function seventhOf(chord_i) {
	return (chord_prog[chord_i].root + 6) % 7;
}

function bassOf(chord_i) {
	if (chord_prog[chord_i].inversion == 0) {
		return rootOf(chord_i);
	} else if (chord_prog[chord_i].inversion == 1) {
		return thirdOf(chord_i);
	} else if (chord_prog[chord_i].inversion == 2) {
		return fifthOf(chord_i);
	} else {
		return seventhOf(chord_i);
	}
}

//returns the accidental for a major or minor second above this
function secondAccidental(pos, acc, isMajor) {
	letter = pos % 7;
	if ((letter == 1) || (letter == 4)) {
		return (acc + isMajor);
	} else {
		return (acc + isMajor - 1);
	}
}

function halfStepAccidental(note) {
	letter = note.pos % 7;
	if ((letter == 1) || (letter == 4)) {
		return note.accidental + 1;
	} else {
		return note.accidental;
	}
}

//tells if the octave between two notes is perfect
//assumes that there is an octave between them
function isPerfectOctave(upper, lower) {
	return (upper.accidental == lower.accidental);
}

//tells if the fifth between two notes is perfect
//assumes that there is a fifth between them
function isPerfectFifth(upper, lower) {
	if (upper.pos % 7 == 5) {
		if (upper.accidental - 1 == lower.accidental) {
			return true;
		}
	} else {
		if (upper.accidental == lower.accidental) {
			return true;
		}
	}
	return false;
}

//tells if the second between two notes is augmented
//assumes that there is a second between them
function isAugmentedSecond(upper, lower) {
	if ((upper.pos % 7 == 5) || (upper.pos % 7 == 2)) {
		return (upper.accidental - 2 == lower.accidental);
	} else {
		return (upper.accidental - 1 == lower.accidental);
	}
}

function spaceBetween(note1, note2) {
	var space = note1.pos - note2.pos;
	if (space < 0) {
		space *= -1;
	}
	return space;
}

function isDiatonic(chord_i) {
	var rootNote = new Note();
	rootNote.pos = chord_prog[chord_i].root;
	rootNote.accidental = chord_prog[chord_i].root_accidental;
	if (!(isInKey(rootNote) || isLeadingTone(rootNote))) {
		return false;
	}
	var quality_here = chord_prog[chord_i].quality;
	// I / I7 / i / i7 / IV / IV7 / iv / iv7
	if ((rootNote.pos == key.root) ||
		(rootNote.pos == (key.root + 3) % 7)) {
		return (quality_here == key.mode);
} else if (rootNote.pos == (key.root + 1) % 7) {
		// ii / ii7
		if (key.mode == "major") {
			return (quality_here == "minor");
		// ii%7
	} else if (chord_prog[chord_i].seventh) {
		return (quality_here == "halfdiminished");
		// iio
	} else {
		return (quality_here == "diminished");
	}
} else if ((rootNote.pos == (key.root + 2) % 7) ||
	(rootNote.pos == (key.root + 5) % 7)) {
		// iii / iii7
		if (key.mode == "major") {
			return (quality_here == "minor");
		// III / III7
	} else {
		return (quality_here == "major");
	}
} else if (rootNote.pos == (key.root + 4) % 7) {
	if (key.mode == "major") {
			// V7
			if (chord_prog[chord_i].seventh) {
				return (quality_here == "dominant");
			// V
		} else {
			return (quality_here == "major")
		}
	} else {
			// V7 / v7
			if (chord_prog[chord_i].seventh) {
				return ((quality_here == "dominant") ||
					(quality_here == "minor"));
			// V / v
		} else {
			return (quality_here != "diminished");
		}
	}
} else if (!isLeadingTone(rootNote)) {
	if (key.mode == "major") {
		return false;
		// VII7 (rare but possible)
	} else if (chord_prog[chord_i].seventh) {
		return (quality_here == "dominant");
		// VII
	} else {
		return (quality_here == "major");
	}
} else {
		// vii%7
		if ((key.mode == "major") && (chord_prog[chord_i].seventh)) {
			return (quality_here == "halfdiminished");
		// viio / viio7
	} else {
		return (quality_here == "diminished");
	}
}
}

//returns true if the chords share the same set of pitches, false otherwise
function isSimilar(chord1, chord2) {
	return ((rootOf(chord1) == rootOf(chord2)) &&
		(chord_prog[chord1].root_accidental == chord_prog[chord2].root_accidental) &&
		(chord_prog[chord1].seventh == chord_prog[chord2].seventh) &&
		(chord_prog[chord1].quality == chord_prog[chord2].quality));
}

function isII6(chord_i) {
	return ((!chord_prog[chord_i].seventh) &&
		(chord_prog[chord_i].inversion == 1) &&
		(chord_prog[chord_i].root == (key.root + 1) % 7));
}

//Returns the number of common tones between two chords
function numCommonTones(chord1, chord2) {
	var numTones = 0;
	//check each permutation for possible common tones
	if (isSameIn(rootOf(chord1), rootOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (isSameIn(rootOf(chord1), thirdOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (isSameIn(rootOf(chord1), fifthOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (chord_prog[chord2].seventh &&
		(isSameIn(rootOf(chord1), seventhOf(chord2), chord1, chord2))) {
		numTones++;
	}
	if (isSameIn(thirdOf(chord1), rootOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (isSameIn(thirdOf(chord1), thirdOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (isSameIn(thirdOf(chord1), fifthOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (chord_prog[chord2].seventh &&
		(isSameIn(thirdOf(chord1), seventhOf(chord2), chord1, chord2))) {
		numTones++;
	}
	if (isSameIn(fifthOf(chord1), rootOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (isSameIn(fifthOf(chord1), thirdOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (isSameIn(fifthOf(chord1), fifthOf(chord2), chord1, chord2)) {
		numTones++;
	} else if (chord_prog[chord2].seventh &&
		(isSameIn(fifthOf(chord1), seventhOf(chord2), chord1, chord2))) {
		numTones++;
	}
	if (chord_prog[chord1].seventh) {
		if (isSameIn(seventhOf(chord1), rootOf(chord2), chord1, chord2)) {
			numTones++;
		} else if (isSameIn(seventhOf(chord1), thirdOf(chord2), chord1, chord2)) {
			numTones++;
		} else if (isSameIn(seventhOf(chord1), fifthOf(chord2), chord1, chord2)) {
			numTones++;
		} else if (chord_prog[chord2].seventh &&
			(isSameIn(seventhOf(chord1), seventhOf(chord2), chord1, chord2))) {
			numTones++;
		}
	}
	return numTones;
}

function isSameIn(pos1, pos2, chord1, chord2) {
	return ((pos1 == pos2) &&
		(rightAccidental(pos1, chord1) == rightAccidental(pos2, chord2)));
}

///////////////////////// CONVERSION TO ABC /////////////////////////////

var noteTable = ["A,,,,", "B,,,,", "C,,,", "D,,,", "E,,,", "F,,,", "G,,,",
		 "A,,,", "B,,,", "C,,", "D,,", "E,,", "F,,", "G,,", "A,,",
		 "B,,", "C,", "D,", "E,", "F,", "G,", "A,", "B,", "C", "D",
		 "E", "F", "G", "A", "B", "c", "d", "e", "f", "g"];

function convert() {
    if (best_hymn == undefined) {
		return NaN;
    }
    var ABC = "X:1\nT:";
    ABC = ABC.concat(songTitle, "\nM:", meter, "\nL:1/4\n", 
		     "%%score (S A) (T B)\n", 
		     "V:S clef=treble name=Soprano snm=S\n", 
		     "V:A clef=treble name=Alto snm=A\n",
		     "V:T clef=bass name=Tenor snm=T\n",
		     "V:B clef=bass name=Bass snm=B\n");
    var ABCkey = getABCkey(key);
    ABC = ABC.concat("K:", ABCkey, "\n");

    var ABCsoprano = getVoice(3);
    var ABCalto = getVoice(2);
    var ABCtenor = getVoice(1);
    var ABCbass = getVoice(0);
    ABC = ABC.concat("V:S\n", ABCsoprano, "|\n");
    ABC = ABC.concat("V:A\n", ABCalto, "|\n");
    ABC = ABC.concat("V:T\n", ABCtenor, "|\n");
    ABC = ABC.concat("V:B\n", ABCbass, "|\n");

//  ABCJS.renderAbc('outputimage', ABC);
    best_hymn = undefined; //change to clean_up();
    return ABC;
}

function getABCkey(key) {
    var ABCkey = noteTable[key.root][0];

    if (key.root_accidental == -1) {
	ABCkey = ABCkey.concat("b");
    } else if (key.root_accidental == 1) {
	ABCkey = ABCkey.concat("#");
    }

    if (key.mode == "minor") {
	ABCkey = ABCkey.concat("m");
    }

    return ABCkey;
}

function getVoice(voiceIndex) {
    var voiceABC = "";
    var beatCount = 0;
    var measureAcc = new Array(7);
    measureAcc = resetMeasureAcc(measureAcc);

    for (var i = 0; i < best_hymn.chords.length; i++) {
	var currNote = noteTable[best_hymn.chords[i].voices[voiceIndex].pos];
	var currAcc = getCurrAcc(i, voiceIndex, measureAcc);
	var currDur = best_hymn.chords[i].duration;
	beatCount += currDur;

	if (beatCount == meter[0]) {
	    voiceABC = putNote(voiceABC, currNote, currAcc, currDur, false);
	    voiceABC = voiceABC.concat("|");
	    beatCount = 0;
	    measureAcc = resetMeasureAcc(measureAcc);
	} else if (beatCount > meter[0]) {
	    var leftInMeas = meter[0] - (beatCount - currDur);
	    // put a note equal to the rest of the measure with a tie
	    voiceABC = putNote(voiceABC, currNote, currAcc, leftInMeas, true);
	    voiceABC = voiceABC.concat("|");
	    beatCount = beatCount - meter[0];
	    // while there is more than a full measure left in the chord
	    while (beatCount > meter[0]) {
		voiceABC = putNote(voiceABC, currNote, NaN, meter[0], true);
		beatCount = beatCount - meter[0];
		voiceABC = voiceABC.concat("|");
	    }
	    // then put the rest of the note
	    voiceABC = putNote(voiceABC, currNote, NaN, beatCount, false);
	    if (beatCount == meter[0]) {
		voiceABC = voiceABC.concat("|");
		beatCount = 0;
	    }
	    measureAcc = resetMeasureAcc(measureAcc);
	} else {
	    voiceABC = putNote(voiceABC, currNote, currAcc, currDur, false);
	}
    }

    if (beatCount > 0) { // fill in last measure with rests
	while (beatCount < meter[0]) {
	    if (beatCount == 2 && meter[0] == 4) {
		voiceABC = voiceABC.concat("z2 ");
		beatCount += 2;
	    } else {
		voiceABC = voiceABC.concat("z ");
		beatCount++;
	    }
	}
	voiceABC = voiceABC.concat("|");
    }
		
    return voiceABC;
}

function getCurrAcc(crdInd, vInd, measureAcc) {
    var accNote = best_hymn.chords[crdInd].voices[vInd].accidental;
    var mAccNote = measureAcc[best_hymn.chords[crdInd].voices[vInd].pos % 7];
    //if the note has a different accidental than measureAcc at this note
    if (accNote != mAccNote) {
	//then update the measure's accidentals	
	measureAcc[best_hymn.chords[crdInd].voices[vInd].pos % 7] = accNote;
	//and put the accidental on the note
	return accNote;
    }
    else {
	return NaN;
    }
}

function resetMeasureAcc(measureAcc) {
    for (var i = 0; i < 7; i++) {
	measureAcc[i] = key_accidentals[i];
    }
    return measureAcc;
}

function putNote(voiceABC, currNote, currAcc, currDuration, tie) {
    switch(currAcc) {
	case -2:
	voiceABC = voiceABC.concat("__");
	break;

	case -1:
	voiceABC = voiceABC.concat("_");
	break;

	case 0:
	voiceABC = voiceABC.concat("=");
	break;

	case 1:
	voiceABC = voiceABC.concat("^");
	break;

	case 2:
	voiceABC = voiceABC.concat("^^");
	break;
    }

    voiceABC = voiceABC.concat(currNote);

    if (currDuration > 1) {
	voiceABC = voiceABC.concat(currDuration);
    }
    if (tie == true) {
	voiceABC = voiceABC.concat("-");
    }

    voiceABC = voiceABC.concat(" ");
    return voiceABC;
}


