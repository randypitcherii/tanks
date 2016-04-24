//get current user and game ID for this session
var name = $("#currentUser").text();
var gameID = $("#gameID").text();


//initialize the keyboard controls
var inputType = {};
inputType.left = keyboard(37);
inputType.up = keyboard(38);
inputType.right = keyboard(39);
inputType.down = keyboard(40);
inputType.enter = keyboard(13);
inputType.backspace = keyboard(8);
inputType.space = keyboard(32);
inputType.button_f = keyboard(70);

//initialize move object for sending move to server
var moveObject = {};
moveObject.name = name;
moveObject.move = "";//initial value.
moveObject.gameID = gameID;

//initialize the websocket
var socket = io();

//join room with gameID
socket.emit('join', gameID);

//create socket input handler.
//moveCommand has same structure as moveObject
socket.on('move', function(moveCommand) {
	var tankToMove;
	var isLocal;
	//check which tank to move. If name matches moveCommand name, move tankA
	if (moveCommand.name === name) {
		tankToMove = tankA;
		isLocal = true;
	} else {
		tankToMove = tankB;
		isLocal = false;
	}

	//send the command to the tankMovement.js file for processing
	handleCommand(tankToMove, isLocal, moveCommand.move);
});

/**
 * This function creates the event listeners for sending
 * movement commands to the server from keypresses.
 */
function initTankControls() {
	//handle the left arrow key press
	inputType.left.press = function() {
		moveObject.move = moveset.left;
		socket.emit('move', moveObject);
	}

    //handle the left arrow key release
    inputType.left.release = function() {
        moveObject.move = moveset.leftRelease;
        socket.emit('move', moveObject);
    }

	//handle the up press
    inputType.up.press = function() {
    	moveObject.move = moveset.up;
		socket.emit('move', moveObject);
    }

    //handle the up release
    inputType.up.release = function() {
        moveObject.move = moveset.upRelease;
        socket.emit('move', moveObject);
    }

    //handle the right press
    inputType.right.press = function() {
    	moveObject.move = moveset.right;
		socket.emit('move', moveObject);
    }

    //handle the right release
    inputType.right.release = function() {
        moveObject.move = moveset.rightRelease;
        socket.emit('move', moveObject);
    }

    //handle the down press
    inputType.down.press = function() {
    	moveObject.move = moveset.down;
		socket.emit('move', moveObject);
    }

    //handle the down release
    inputType.down.release = function() {
        moveObject.move = moveset.downRelease;
        socket.emit('move', moveObject);
    }

    //handle the enter press
    inputType.enter.press = function() {
    	moveObject.move = moveset.enter;
		socket.emit('move', moveObject);
    }

    //handle the backspace press
    inputType.backspace.press = function() {
    	moveObject.move = moveset.backspace;
		socket.emit('move', moveObject);
    }

    //handle the space press
    inputType.space.press = function() {
    	moveObject.move = moveset.space;
		socket.emit('move', moveObject);
    }

    //handle the button_f press
    inputType.button_f.press = function() {
    	moveObject.move = moveset.button_f;
		socket.emit('move', moveObject);
    }
}