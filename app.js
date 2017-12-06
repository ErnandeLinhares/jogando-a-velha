"use strict";

const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require("path");

const getRandomInt = require('./modules/getRandomInt');


app.disable("x-powered-by");

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req,res) => {
	res.sendFile(path.join(__dirname+'/index.html'));
});


io.on('connection', function(socket){

	console.log('a user connected');

	socket.on('disconnect', () => {
		
		console.log('user disconnected');
	})
	.on('createLink', () => {

		io.to(socket.id).emit('linkShared', Number(new Date())+"_"+getRandomInt(1, 999) );

	});

});


server.listen(PORT);