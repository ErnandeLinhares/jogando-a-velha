"use strict";

const io = require('socket.io')();

const getRandomInt = require('./modules/getRandomInt');

const PORT = process.env.PORT || 5000;

io.on('connection', function(socket){

	console.log('a user connected');

	socket.on('disconnect', () => {
		
		console.log('user disconnected');
	})
	.on('createLink', () => {

		io.to(socket.id).emit('linkShared', Number(new Date())+"_"+getRandomInt(1, 999) );

	});

});


io.listen(PORT);