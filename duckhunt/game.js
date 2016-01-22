function init() {
	//load the canvas element
	canvas = document.getElementById("game_canvas");
	ctx = canvas.getContext("2d");

	//draw the background
	var backgrd = new Image();
	backgrd.src = 'duckhunt-background.gif';
	backgrd.onload = function() {
		ctx.drawImage(backgrd, 0, 0);
	}

	//draw the birds
	var birds = new Image();
	birds.src = 'duckhunt_various_sheet.png';
	birds.onload = function() {
		ctx.drawImage(birds, 0, 110, 40, 40, 100, 70, 40, 40);
		ctx.drawImage(birds, 125, 110, 40, 40, 160, 50, 40, 40)
	}
}