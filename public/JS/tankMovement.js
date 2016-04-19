//set universal command types. All moves stored in 'moveset'
var moveset = {};
moveset.left = "leftMove";
moveset.leftRelease = "leftRelease";
moveset.up = "upMove";
moveset.upRelease = "upRelease";
moveset.right = "rightMove";
moveset.rightRelease = "rightRelease";
moveset.down = "downMove";
moveset.downRelease = "downRelease";
moveset.enter = "enter";
moveset.backspace = "backspace";
moveset.space = "space";
moveset.button_f = "f";

/**
 * This function handles the left arrow press for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function leftMove(tank, isLocal) {
	if (isLocal) {
		tank.rotation = 270 / 180 * Math.PI; 
	    tank.vx = -5;
	    tank.vy = 0;
	} else {
		tank.rotation = 0.5 * Math.PI;
        tank.vx = 5;
        tank.vy = 0;
	}
}

/**
 * This function handles the left arrow release for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function leftRelease(tank, isLocal) {
	tank.vx = 0;
}

/**
 * This function handles the up arrow press for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function upMove(tank, isLocal) {
	if (isLocal) {
		tank.rotation = 0;
        tank.vy = -5;
        tank.vx = 0;
	} else {
		tank.rotation = Math.PI;
        tank.vy = 5;
        tank.vx = 0;
	}
}

/**
 * This function handles the up arrow release for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function upRelease(tank, isLocal) {
	tank.vy = 0;
}

/**
 * This function handles the right arrow press for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function rightMove(tank, isLocal) {
	if (isLocal) {
		tank.rotation = 0.5 * Math.PI;
        tank.vx = 5;
        tank.vy = 0;
	} else {
		tank.rotation = 270 / 180 * Math.PI; 
	    tank.vx = -5;
	    tank.vy = 0;
	}
}

/**
 * This function handles the right arrow release for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function rightRelease(tank, isLocal) {
	tank.vx = 0;
}

/**
 * This function handles the down arrow press for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function downMove(tank, isLocal) {
	if (isLocal) {
		tank.rotation = Math.PI;
        tank.vy = 5;
        tank.vx = 0;
	} else {
		tank.rotation = Math.PI;
        tank.vy = -5;
        tank.vx = 0;
	}
}

/**
 * This function handles the down arrow release for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function downMove(tank, isLocal) {
	tank.vy = 0;
}

/**
 * This function handles the enter button press for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function enterMove(tank, isLocal) {
}

/**
 * This function handles the backspace button press for the specified tank object.
 *
 * var tank - tank object to be moved
 * var isLocal - boolean. True means tank is the local tank, false means tank is opponent 
 */
function backspaceMove(tank, isLocal) {
}

/**
 * This function handles the space button press for the specified tank object.
 *
 * var tank - tank object to be moved
 */
function spaceMove(tank) {
	fire(tank);
}

/**
 * This function handles the F press for the specified tank object.
 *
 * var tank - tank object to switch the ammo flag for.
 */
function f_buttonMove(tank) {
	tank.switch_ammo_flag;
}

/**
 * This function dispatches the incoming command from the server to the
 * correct handler function.
 *
 * var tank - the tank being handled in this command
 * isLocal - boolean: true if 
 */
function handleCommand(tank, isLocal, command) {
	if (command === moveset.left) {
		leftMove(tank, isLocal);
	} else if (command === moveset.leftRelease) {
		leftRelease(tank, isLocal);
	} else if (command === moveset.up) {
		upMove(tank, isLocal);
	} else if (command === moveset.upRelease) {
		upRelease(tank, isLocal);
	} else if (command === moveset.right) {
		rightMove(tank, isLocal);
	} else if (command === moveset.rightRelease) {
		rightRelease(tank, isLocal);
	} else if (command === moveset.down) {
		downMove(tank, isLocal);
	}  else if (command === moveset.downRelease) {
		downRelease(tank, isLocal);
	} else if (command === moveset.enter) {
		enterMove(tank, isLocal);
	} else if (command === moveset.backspace) {
		backspaceMove(tank, isLocal);
	} else if (command === moveset.space) {
		spaceMove(tank, isLocal);
	} else if (command === moveset.button_f) {
		f_buttonMove(tank);
	}
}
