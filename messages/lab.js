//JavaScript for messages lab

var request = new XMLHttpRequest();

function parse() {
	request.open("GET", "http://messagehub.herokuapp.com/messages.json", true);
	request.onreadystatechange = function() {
		if (request.readyState == 4) {
			msgs = document.getElementById("messages");
			if (request.status == 200) {
				msg_data = JSON.parse(request.responseText);
				for (i = 0; i < msg_data.length; i++) {
					msgs.innerHTML += '<p><span class="msg">' +
						msg_data[i].content +
						'   <span class="username">--' +
						msg_data[i].username +
						'</span></span></p>';
				}
			} else {
				msgs.innerHTML = "<p>Oops, something went wrong.</p>";
			}
		}
	}
	request.send(null);
}