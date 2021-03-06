"use strict";

var thingsToLoad = ["../images/explorer.png","../fonts/emulogic.ttf","../images/dungeon.png",
    "../images/blob.png","../images/door.png","../images/bunny.png"];

var g = hexi(520,520,setup,thingsToLoad,load);

g.scaleToWindow();
g.start();


var tankA = undefined,
    tankB = undefined,
    scoreDisplay = undefined,
    music = undefined,
    bullets = undefined,
    winner = undefined,
    shootSound = undefined,
    explosionSound = undefined,
    aliens = undefined,
    score = undefined,
    scoreNeededToWin = undefined,
    alienFrequency = undefined,
    alienTimer = undefined,
    gameOverMessage = undefined,
    fire_bullet = undefined,
    bunny = undefined;
//missle_fired = undefined;
//switch_ammo_flag = 1;

// this loads stuff before the games start making sure everything is loading properly before starting
function load() {
	g.loadingBar();
}

function setup() {
	var background = g.sprite("../images/dungeon.png");

	tankA = g.sprite("../images/user_tank_ed1.png");
	tankA.width = g.canvas.width / 16;
	tankA.height = g.canvas.height / 8;

	tankB = g.sprite("../images/user_tank_ed1.png");
	tankB.width = g.canvas.width / 16;
	tankB.height = g.canvas.height / 8;

	tankA.anchor.x = 0.5;
	tankA.anchor.y = 0.5;

	tankB.anchor.x = 0.5;
	tankB.anchor.y = 0.5;

	tankB.rotation = Math.PI;

	g.stage.putBottom(tankA,0,-tankA.height);
	g.stage.putTop(tankB,0,tankB.height + 5);


	//setting up the bullets array (a lot of it ! ) variable
	bullets = [];

	//a lot of aliens variable!
	aliens = [];

	scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);

	// music?

	//set the missle fired to false
	tankA.missle_fired = false;

	//set the default wepaon type
	tankA.switch_ammo_flag = 1;

	//setting up the keyboard keys =) jsut following the ascii characters!
	var left = keyboard(37),
	    up = keyboard(38),
	    right= keyboard(39),
	    down = keyboard(40),
	    enter = keyboard(13),
	    backspace = keyboard(8),
	    space = keyboard(32),
	    button_f = keyboard(70);

	// when 'f' button on keyboard is pressed
	button_f.press = function() {
		//console.log("f is pressed");  
		tankA.switch_ammo_flag *= -1;
	};

	// LEFT arrow key
	left.press = function() {
		//console.log("left key pressed");
		tankA.rotation = 270 / 180 * Math.PI;

		//Change the player's velocity when the key is pressed.
		tankA.vx = -5;
		tankA.vy = 0;
	};
	//Assign key `release` method.
	left.release = function() {
		//If the left arrow has been released, and the right arrow isn't down,
		//and the player isn't moving vertically:
		//Stop the player.
		if (!right.isDown && tankA.vy === 0) {
			tankA.vx = 0;
		}
	};

	//RIGHT arrow key
	right.press = function () {
		tankA.rotation = 0.5 * Math.PI;
		tankA.vx = 5;
		tankA.vy = 0;
	};

	right.release = function () {
		if (!left.isDown && tankA.vy === 0) {
			tankA.vx = 0;
		}
	};

	//UP key
	up.press = () => {
		tankA.rotation = 0;
		tankA.vy = -5;
		tankA.vx = 0;
	};

	up.release = () => {
		if (!down.isDown && tankA.vx === 0) {
			tankA.vy = 0;
		}
	};

	// DOWN
	down.press = () => {
		tankA.rotation = Math.PI;
		tankA.vy = 5;
		tankA.vx = 0;
	};
	down.release = () => {
		if (!up.isDown && tankA.vx === 0) {
			tankA.vy = 0;
		}
	};

	//when space button is pressed FIRE AWAY!!!!
	/*
	   space.press = function() {
	   missle_fired = true;
	   if(switch_ammo_flag == 1) {
	   g.shoot(tankA,tankA.rotation - Math.PI/2,tankA.halfWidth,0,g.stage,7,bullets,
	   function() {;
	   fire_bullet = g.sprite("../images/bullet.png");
	   fire_bullet.width = tankA.width ;
	   fire_bullet.height = tankA.height ;
	   fire_bullet.rotation = tankA.rotation;

	   return fire_bullet;
	   });
	   } else {
	   g.shoot(tankA,tankA.rotation - Math.PI/2,tankA.halfWidth,0,g.stage,3,bullets,
	   function() {

	   bunny = g.sprite("../images/bunny.png");
	//bunny.width = tankA.width ;
	//bunny.height = tankA.height ;
	bunny.rotation = tankA.rotation;

	return bunny;
	});
	}
	// can play shooting sound here if u want when the space key is pressed!

	};
	*/

	space.press = () => {
		fire(tankA);
	};


	g.state = play;

	score = 0;
	scoreNeededToWin = 60;
	alienTimer = 0;
	alienFrequency = 100;
	winner = "";
}

//fire missle from whatever tank
function fire(tank) {
	console.log("tank shooted!");
	tank.missle_fired = true;
	if(tank.switch_ammo_flag == 1) {
		g.shoot(tank,tank.rotation - Math.PI/2,tank.halfWidth,0,g.stage,7,bullets,
				function() {;
					fire_bullet = g.sprite("../images/bullet.png");
					fire_bullet.width = tank.width ;
					fire_bullet.height = tank.height ;
					fire_bullet.rotation = tank.rotation;

					return fire_bullet;
				});
	} else {
		g.shoot(tank,tank.rotation - Math.PI/2,tank.halfWidth,0,g.stage,3,bullets,
				function() {

					bunny = g.sprite("../images/bunny.png");
					//bunny.width = tankA.width ;
					//bunny.height = tankA.height ;
					bunny.rotation = tank.rotation;

					return bunny;
				});
	}
	// can play shooting sound here if u want when the space key is pressed!

}

// get stram of data from socket and update enemy position
function updateEnemy(enemyX, enemyY, enemyRotation, enemyMissleType, enemyShoot) {

	// convert coordinates first
	// for now just mirror image what tankA does

	//invert and set position
	tankB.x = g.canvas.width - enemyX;
	tankB.y = g.canvas.height - enemyY;

	//invert and set rotaion
	tankB.rotation = enemyRotation - Math.PI;

	//set the missle type
	tankB.switch_ammo_flag = enemyMissleType;

	// if enemy shooted, fire the missle 
	if (enemyShoot) {	
		console.log("enemy shooted!!");
		fire(tankB);
	}
}



function play() {
	g.contain(tankA,g.stage);
	g.move(tankA);
	g.move(bullets); 
	g.contain(tankA,g.stage);

	alienTimer++;
	// this is to slowly spawn aliens
	if(alienTimer === alienFrequency) {
		var alienFrames = ["../images/blob.png"]; // can add more frames so that what should it appear when it dies 
		var alien = g.sprite(alienFrames);
		// this is where u add the states such as alive or something
		alien.states = {
			alive: 0
		};


		alien.y = 0 - alien.height; // set it super above
		alien.x = g.randomInt(0,14) * alien.width;

		//set its speed
		alien.vy = 1;

		//push the alien to aliens array!
		aliens.push(alien);

		alienTimer = 0;

		if(alienFrequency > 2 ) {
			alienTimer--;
		}
	}

	g.move(aliens);
	//checkign for collision between aliens and bullets


	aliens = aliens.filter(function (alien) {

		//A variable to help check if the alien is
		//alive or dead.
		var alienIsAlive = true;

		//Filter though all the bullets.
		bullets = bullets.filter(
			function (bullet) {

				//Check for a collision between an alien and bullet.
				if (g.hitTestRectangle(alien, bullet)) {

					//Remove the bullet sprite.
					g.remove(bullet);



					//Show the alien's `destroyed` state.
					//alien.show(alien.states.destroyed);

					//You could alternatively use the frame number,
					//like this:
					//alien.show(1);

					//Play the explosion sound.
					//explosionSound.play();

					//Stop the alien from moving.
					alien.vy = 0;

					//Set `alienAlive` to false so that it can be
					//removed from the array.
					alienIsAlive = false;

					//Wait for 1 second (1000 milliseconds) then
					//remove the alien sprite.
					g.wait(1000, function () {
						return g.remove(alien);
					});

					//Update the score.
					//score += 1;

					//Remove the bullet from the `bullets array.
					return false;
				} else {

					//If there's no collision, keep the bullet in the
					//bullets array.
					return true;
				}
			});

	//Return the value of `alienIsAlive` back to the
	//filter loop. If it's `true`, the alien will be
	//kept in the `aliens` array.
	//If it's `false` it will be removed from the `aliens` array.
	return alienIsAlive;
	});

	//update enemy tak that would mirror tankA movements for now
	updateEnemy(tankA.x, tankA.y, tankA.rotation, tankA.switch_ammo_flag, tankA.missle_fired);

	tankA.missle_fired = false;

}














