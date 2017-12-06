"use strict";

//$(function () {

	//var connection_socket = "http://localhost:5000/";

	var socket = io(/*connection_socket*/);

	socket.on("linkShared", function(link){

		console.log("link", link);
	});

	console.log(socket);

	
//});