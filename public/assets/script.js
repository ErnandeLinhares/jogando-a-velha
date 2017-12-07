"use strict";

//$(function () {

	//var connection_socket = "http://localhost:5000/";

	var socket = io(/*connection_socket*/);

	socket.on("linkShared", function(link){

		console.log("link", link);
	});

	console.log(socket);

	
//});


























"use strict";

$(function(){



	var vez = 1;
	var vencedor = "";

	var my_id;
	var ultimo_jogador = "";
	


	function casasIguais(a, b, c){
	    var casaA = $("#casa"+a);
	    var casaB = $("#casa"+b);
	    var casaC = $("#casa"+c);
	    var bgA = $("#casa"+a).css("background-image");
	    var bgB = $("#casa"+b).css("background-image");
	    var bgC = $("#casa"+c).css("background-image");
	    
	    if( (bgA === bgB) && (bgB === bgC) && (bgA !== "none" && bgA !== "")){
	        
	        if(bgA.indexOf("1.png") >= 0)
	            vencedor = "1";
	        else
	            vencedor = "2";
	        return true;
	    }
	    else{
	        return false;
	    }
	}

	var aguardando = false;

	var resetJogo = function(){
		
		setTimeout(function(){
			$(".casa").each(function(){
	    		$(this).css("background-image", "none");
	    			
	    	});

			$("#resultado").html(" ");

			aguardando = false;
			
		}, 1000);
	};


	var checkCasasIguais = function(){

		return ( casasIguais(1, 2, 3) ||
				 casasIguais(4, 5, 6) ||
				 casasIguais(7, 8, 9) ||
				 casasIguais(1, 4, 7) ||
				 casasIguais(2, 5, 8) ||
				 casasIguais(3, 6, 9) ||
				 casasIguais(1, 5, 9) ||
				 casasIguais(3, 5, 7) 
				) ? true : false;
	};


	function verificarFimDeJogo(){
	    
	    if( checkCasasIguais()){
	        $("#resultado").html("<h1>O jogador " + vencedor + "venceu! </h1>");
	    	aguardando = true;
	    	resetJogo();
	        
	    }else{

	    	var preenchidas = 0;
	    	$(".casa").each(function(){
	    		if($(this).css("background-image") !== "none")
	    			preenchidas++
	    	});

	    	if(preenchidas === 9){
	    		$("#resultado").html("<h1>Deu velha</h1><br><img class='velha' src='http://saiadopilotoautomatico.com.br/wp-content/uploads/2013/12/velha-desbocada1.jpg' />");
	    		aguardando = true;
	    		setTimeout(function(){
					resetJogo();
	    		}, 1000);
	    	}

	    }
	}


	var marcarJogada = function(id, quem){
		
		if(!my_id)
			return alert("Informe o id correto");

		var t = $("#"+id);

		if(ultimo_jogador == "EU")
			return alert("Aguarde a jogada do seu adversário");

		if(aguardando)
			return;

		if(quem === "EU")
    		socket.emit('jogada', id, my_id);
	    

	    var bg = t.css("background-image");
	    if(bg === "none" || bg === "")
	    { 

	        var fig = "url(assets/" + vez.toString() + ".png) center no-repeat ";
	        t.css("background", fig);
	        vez = (vez == 1? 2:1); 
	        verificarFimDeJogo();
	    }
	};


	$(".casa").click(function(){

		marcarJogada($(this).attr("id"), "EU");
		ultimo_jogador = "EU";
	});



	//var connection_socket = "http://localhost:5000/";

	var socket = io(/*connection_socket*/);
	
	socket.on('connect_timeout', function ( data ) {
        $("#socket").html("connect_timeout");
    })
    .on('reconnecting', function ( data ) {
        $("#socket").html('reconnecting');
    })
    .on('connecting', function ( data ) {
        $("#socket").html('connecting chat');
    })
    .on('connect', function ( data ) {

	   	//console.log('connect');
    	//var user_connect = prompt("Qual é o seu ID?");

    	//if(user_connect)
	        socket.emit('join', "user_connect");
    })
    .on('disconnect', function ( data ) {
    	$("#socket").html("disconnect");
    	socket.emit("reset");
    })
    .on("user_id", function(id){
    	$("#socket").html("Meu id: "+id);
    	my_id = id;    	
    })
    .on("usuario_incorreto", function(e){
    	$("#socket").html(e);
	})
	.on("jogou", function(jogada){

    	if(jogada.socket != my_id){
			ultimo_jogador = "ADVERSARIO";
			marcarJogada(jogada.casa, "ADVERSARIO");
		}
	})
	.on("resetar", function(jogada){
    	resetJogo();
    });

	socket.on("error", function(e){
		$("#resultado").html(e);
		socket.emit("reset");
	});

});