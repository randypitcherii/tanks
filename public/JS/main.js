"use strict";

var thingsToLoad = ["../images/wall.jpg","../sounds/explosion.mp3","../images/dynamite.png","../images/explorer.png","../fonts/emulogic.ttf","../images/dungeon.png","../images/explosion.jpeg","../images/blob.png","../images/door.png","../images/bunny.png","../sounds/launch_missile.mp3","../sounds/missile_heat.mp3","../sounds/normal_bullets.mp3","../sounds/bullets_hit.mp3","../images/up.png","../images/bullet.png","../images/smoke.png","../images/debris.png","../images/monster_boss.png","../sounds/missile_reloading.wav","../images/start_button.png","../images/restart_button.png"];

var g = hexi(512,512,start,thingsToLoad,load);

g.scaleToWindow();
g.start();


var background = undefined,
    tankA = undefined,
    tankB = undefined,
    turretA = undefined,
    turretB = undefined,
    bullet = undefined,
    bullets = undefined,
    healthBar = undefined,
    message = undefined,
    gameScene = undefined,
    gameOverScene = undefined,
    launch_missileSound = undefined,
    missile_hitSound = undefined,
    normal_bullets_launchSound = undefined,
    normal_bullets_hitSound = undefined,
    missile_reloading_sound = undefined,
    fire_bullet = undefined,
    fire_bullets = undefined,
    tankA_outerBar = undefined,
    tankA_innerBar = undefined,
    healthBar_tankA = undefined,
    tankB_outerBar = undefined,
    tankB_innerBar = undefined,
    healthBar_tankB = undefined,
    tankB_outerBar = undefined,
    tankB_innerBar = undefined,
    tankA_outerBar = undefined,
    tankA_innerBar = undefined,
    gameOverMessage = undefined,
    start_button = undefined,
    healthBar_tankA_prev = undefined,
    healthBar_tankB_prev = undefined;


function load() {
	g.loadingBar();
}

// start here
function start() {
	//load the start button
	start_button = g.button(["../images/start_button.png"]);
	start_button.visible = true;
	console.log(start_button.width);
	g.stage.putCenter(start_button,g.stage.width/2 - start_button.width/2, g.stage.height/2);

	/*
	   When the user clicks it goes to the setup place!
	   */
	start_button.release = () => {
		start_button.visible = false; // set it to be not visible!
		start_button.interact = false; // dont want it to be interacted even though it is invisible
		setup();
	};

}



function setup() {
	gameScene = g.group();
	// adding the tank and the red line as a turret
	tankA = g.rectangle(32, 32, "green"), turretA = g.line("red", 10, 0, 0, 32, 0);
	tankA.setPivot(0.5,0.5);
	tankA.name = "tankA";
	tankA.addChild(turretA);
	turretA.x = 0;
	turretA.y = 0;

	g.stage.putBottom(tankA);
	//tankA.rotation = 3/2 * Math.PI;
	turretA.rotation = 3/2 * Math.PI;
	console.log("turretA rotation is " + turretA.rotation);
	//g.stage.putTop(tankB);
	//tankA.rotation = 3/2 * Math.PI;

	/*
	   setting up tank B
	   */
	tankB = g.rectangle(32, 32, "blue"), turretB = g.line("red", 10, 0, 0, 32, 0);
	tankB.name = "tankB";
	tankB.setPivot(0.5,0.5);
	tankB.addChild(turretB);
	turretB.x = 0;
	turretB.y = 0;
	gameScene.addChild(tankB);


	g.stage.putTop(tankB);
	console.log("the initial tank A rotaton is " + tankA.rotation);
	tankB.rotation = Math.PI;
	turretB.rotation = -Math.PI/2;
	console.log("the initial tank B rotaton is " + tankB.rotation);

	//set the missle fired to false
	tankA.missle_fired = false;
	tankB.missle_fired = false;

	//set the default wepaon type
	tankA.switch_ammo_flag = 1;
	//for the mirror image test!
	tankB.switch_ammo_flag = 1;

	//set the tank is not current;y reloading
	tankA.missle_reloadFinish_flag = true;
	//for the mirror image test!
	tankB.missle_reloadFinish_flag = true;

	/*
	   setting the health bar for TANKS
	   */

	//creating the health bar for tankB
	tankB_outerBar = g.rectangle(100, 16, "black"),
		       tankB_innerBar = g.rectangle(100, 16, "red");

	healthBar_tankB = g.group(tankB_outerBar, tankB_innerBar);
	healthBar_tankB.inner = tankB_innerBar;
	// this is for tankA
	tankA_outerBar = g.rectangle(100, 16, "black"),
		       tankA_innerBar = g.rectangle(100, 16, "green");

	healthBar_tankA = g.group(tankA_outerBar, tankA_innerBar);
	healthBar_tankA.inner = tankA_innerBar;

	healthBar_tankA.x = g.canvas.width - tankA_outerBar.width;
	healthBar_tankA.y = g.canvas.height - tankA_outerBar.height;


	/*
	   initialising the array bullets
	   */
	bullets = [];
	fire_bullets = [];
	/*
	   Loading the sound
	   */
	launch_missileSound = g.sound("../sounds/launch_missile.mp3");
	launch_missileSound.volume = 0.3;
	missile_hitSound = g.sound("../sounds/missile_heat.mp3");
	normal_bullets_launchSound = g.sound("../sounds/normal_bullets.mp3");
	normal_bullets_launchSound.volume = 0.3;
	normal_bullets_hitSound = g.sound("../sounds/bullets_hit.mp3");
	normal_bullets_hitSound.volume = 0.3;

	missile_hitSound.volume = 0.4;
	missile_reloading_sound = g.sound("../sounds/missile_reloading.wav");
	initTankControls();    

	/*
	   setting up keyboard
	   */
	   /*
	var left = keyboard(37),
	    up = keyboard(38),
	    right= keyboard(39),
	    down = keyboard(40),
	    enter = keyboard(13),
	    backspace = keyboard(8),
	    space = keyboard(32),
	    button_f = keyboard(70);
	// turretA.rotation = Math.PI;
	// when 'f' button on keyboard is pressed
	button_f.press = function() {
		//console.log("f is pressed");  
		tankA.switch_ammo_flag *= -1;
		updateEnemy(tankA.switch_ammo_flag);
	};

	// LEFT arrow key
	left.press = function() {
		//console.log("left key pressed");
		tankA.rotation = 270 / 180 * Math.PI;
		//turretA.rotation = tankA.rotation;
		//Change the player's velocity when the key is pressed.
		tankA.vx = -5;
		tankA.vy = 0;
		updateEnemy("left_press");
	};
	//Assign key `release` method.
	left.release = function() {
		//If the left arrow has been released, and the right arrow isn't down,
		//and the player isn't moving vertically:
		//Stop the player.
		if (!right.isDown && tankA.vy === 0) {
			tankA.vx = 0;
			updateEnemy("left_release");
		}
	};

	//RIGHT arrow key
	right.press = function () {
		tankA.rotation = 0.5 * Math.PI;
		//turretA.rotation = 270 / 180 * Math.PI;
		tankA.vx = 5;
		tankA.vy = 0;
		updateEnemy("right_press");

	};

	right.release = function () {
		if (!left.isDown && tankA.vy === 0) {
			tankA.vx = 0;
			updateEnemy("right_release");

		}
	};

	//UP key
    
	up.press = () => {
		tankA.rotation = 0;
		//turretA.rotation = 3/2 * Math.PI;
		tankA.vy = -5;
		tankA.vx = 0;
		updateEnemy("up_press");
	};

	up.release = () => {
		if (!down.isDown && tankA.vx === 0) {
			tankA.vy = 0;
			updateEnemy("up_release");
		}
	};

	// DOWN
	down.press = () => {
		tankA.rotation = 3.14;
		//turretA.rotation = 3/2 * Math.PI;
		tankA.vy = 5;
		tankA.vx = 0;
		updateEnemy("down_press");
	};
	down.release = () => {
		if (!up.isDown && tankA.vx === 0) {
			tankA.vy = 0;
			updateEnemy("down_release");
		}
	};

	
	
	space.press = () => {
		fire(tankA);
		updateEnemy("space_press");
	};
	*/
	g.state = play;

    



}

function play() {
	//console.log("the rotation in playing mode " + turretA.rotation);
	g.move(tankA);
	g.move(tankB);
	//g.move(bullets); 

	g.contain(tankA, g.stage);
	g.contain(turretA, g.stage);
	g.contain(tankB, g.stage);
	g.contain(turretB, g.stage);

	/*
	   collision detection for bullets and tanks
	   */
	bullets = bullets.filter(function (bullet) {

		//Move the bullet
		g.move(bullet);
		if(bullet.x > g.stage.width || bullet.x <= 0 || bullet.y > g.stage.height || bullet.y <= 0) {
			//console.log("i am out of vbound");
			g.remove(bullet);
			return false;
		}


		//Check for a collision with the stage boundary
		//var collision = g.outsideBounds(bullet, g.stage);

		//If there's a collision, display the side that the collision
		//happened on, remove the bullet sprite and filter it out of
		//the `bullets` array
		if (g.hitTestRectangle(tankB,bullet)) {
			g.remove(bullet);
			console.log("hitted with red dot");
			healthBar_tankB.inner.width += -5;
			console.log("health left is " + healthBar_tankB.inner.width);
			normal_bullets_hitSound.play();
			g.createParticles(tankB.x, tankB.y, function () {
				return g.sprite("../images/debris.png");
			}, g.stage, 50);

			//Remove the bullet from the `bullets` array
			return false;
		} else if (g.hitTestRectangle(tankA,bullet)) {
			g.remove(bullet);
			console.log("hitted with red dot");
			healthBar_tankA.inner.width += -5;
			//console.log("health left is " + healthBar_tankA.inner.width);
			normal_bullets_hitSound.play();
			g.createParticles(tankA.x, tankA.y, function () {
				return g.sprite("../images/debris.png");
			}, g.stage, 50);

			//Remove the bullet from the `bullets` array
			return false;
		} 

		//If the bullet hasn't hit the edge of the screen,
		//keep it in the `bullets` array
		return true;
	});


	/*
	   collision detection for fire_bullets and tanks
	   */
	fire_bullets = fire_bullets.filter(function (fire_bullet) {

		//Move the bullet
		g.move(fire_bullet);

		//Check for a collision with the stage boundary
		//var collision = g.outsideBounds(fire_bullet, g.stage);
		if(fire_bullet.x > g.stage.width || fire_bullet.x <= 0 || fire_bullet.y > g.stage.height || fire_bullet.y <= 0) {
			console.log("i am out of vbound");
			g.remove(fire_bullet);
			return false;
		}


		//If there's a collision, display the side that the collision
		//happened on, remove the bullet sprite and filter it out of
		//the `bullets` array
		if (g.hitTestRectangle(tankB,fire_bullet)) {
			g.remove(fire_bullet);
			console.log("hitted with fire_bullet");
			healthBar_tankB.inner.width += -25;
			missile_hitSound.play();
			console.log("health left is " + healthBar_tankB.inner.width);
			g.createParticles(tankB.x, tankB.y,
				function () {
					return g.sprite("../images/explosion.jpeg");
				}
				, g.stage, 50); // when hitted by rocket output some debris

			//Remove the bullet from the `bullets` array
			return false;
		} else if (g.hitTestRectangle(tankA,fire_bullet)) {
			g.remove(fire_bullet);
			console.log("hitted with fire_bullet");
			healthBar_tankA.inner.width += -25;
			missile_hitSound.play();
				console.log("health left is " + healthBar_tankB.inner.width);
			g.createParticles(tankA.x, tankA.y,
					function () {
						return g.sprite("../images/explosion.jpeg");
					}
					, g.stage, 50); // when hitted by rocket output some debris

			//Remove the bullet from the `bullets` array
			return false;
		} 

		//If the bullet hasn't hit the edge of the screen,
		//keep it in the `bullets` array
		return true;
	});


	
	/*
	if(healthBar_tankB.inner.width <= 0 && healthBar_tankA.inner.width <= 0) {
		healthBar_tankA.inner.width = 0;
		healthBar_tankB.inner.width = 0;
		g.state = end("IT'S A DRAW!!!");
	} else if (healthBar_tankB.inner.width <= 0) {
		healthBar_tankB.inner.width = 0;
		g.state = end("YOU WON!!!");
	} else if (healthBar_tankA.inner.width <= 0) {
		healthBar_tankA.inner.width = 0;
		g.state = end("YOU LOST!!!");
	}
	*/
	if (healthBar_tankB.inner.width > healthBar_tankB_prev && healthBar_tankA.inner.width > healthBar_tankA_prev) {
		healthBar_tankA.inner.width = 0;
		healthBar_tankB.inner.width = 0;
		g.state = end("ITS A DRAW!!!");
	} else if(healthBar_tankA.inner.width > healthBar_tankA_prev) {
		healthBar_tankA.inner.width = 0;
		g.state = end("YOU LOST!!!");
	} else if (healthBar_tankB.inner.width > healthBar_tankB_prev) {
			healthBar_tankB.inner.width = 0;
		g.state = end("YOU WON!!!");
	} 

	healthBar_tankA_prev = healthBar_tankA.inner.width
	healthBar_tankB_prev = healthBar_tankB.inner.width;



}

/*
   Function for ending the game 
   */
function end(message) {

	g.pause();
	//console.log("at end");
	gameOverMessage = g.text("", "48px Futura","black",g.stage.width/2 - 120, g.stage.width/2 + 20);
	//gameOverMessage = background.text("", "48px Futura","black",background.width/2,bac);
	gameOverMessage.content = message;
	var restart_button = g.button(["../images/restart_button.png"]);
	g.stage.putCenter(restart_button,0,0);
	restart_button.release = () => {
		restart_button.visible = false;
		restart_button.interact = false;
		reset();
	};
	//g.wait(3000, () => reset());
}


function reset() {

	g.remove(gameOverMessage);
	//healthBar_tankA.inner.width = tankA_innerBar.width;
	//healthBar_tankB.inner.width = tankB_innerBar.width;

	healthBar_tankA.inner.width = 100;
	healthBar_tankB.inner.width = 100;
	g.stage.putBottom(tankA);
	g.stage.putTop(tankB);
	//  console.log("the initial tank A rotaton is " + tankA.	);
	tankB.rotation = Math.PI;


	//background.putBottom(tankA,background.width/2,tankA.height);
	//g.stage.putBottom(tankA,-70,-tankA.height);
	//background.putBottom(tankB,background.width/2,tankA.height);
	// g.stage.putTop(tankB,-70,tankB.height + 5);
	g.remove(bullets);
	g.remove(fire_bullets);
	// g.remove(aliens);
	//g.remove(walls);
	//dust.stop();
	//  createWall();



	g.state = play;
	g.resume();
}



/*
   Mirror enemy
   */
function updateEnemy(command) {
	if(command == "left_press") {
		tankB.rotation = -270 / 180 * Math.PI;
		tankB.vx = 5;
		tankB.vy = 0;

	} else if (command == "left_release") {
		tankB.vx = 0;

	} else if (command == "right_press") {
		tankB.rotation = -0.5 * Math.PI;
		tankB.vx = -5;
		tankB.vy = 0;
	} else if (command == "right_release") {
		tankB.vx = 0;
	} else if (command == "up_press") {
		tankB.rotation = 3.14;
		tankB.vy = 5;
		tankB.vx = 0;
	} else if (command == "up_release") {
		tankB.vy = 0;
	} else if (command == "down_press") {
		tankB.rotation = 0;
		tankB.vy = -5;
		tankB.vx = 0;
	} else if (command == "down_release") {
		tankB.vy = 0;
	} else if (command == "space_press") {
		fire(tankB);
	} else if (command == -1) {
		tankB.switch_ammo_flag = -1;
	} else if (command == 1) {
		tankB.switch_ammo_flag = 1;
	}

}



function fire(tank) {
	console.log("FIRE!!!");
	tank.missle_fired = true;
	if(tank.switch_ammo_flag == 1 && tank.missle_reloadFinish_flag == true) {
		console.log(tank.name + " fire with rocket");

		//dont know why * 6, just trial and error...
		g.shoot(tank,tank.rotation - Math.PI/2,0,-44,g.stage,7,fire_bullets,
				function() {
					fire_bullet = g.sprite("../images/bullet.png");
					fire_bullet.width = tank.width ;
					fire_bullet.height = tank.height ;
					fire_bullet.rotation = tank.rotation;

					return fire_bullet;
				});
		tank.missle_reloadFinish_flag = false;

		//trying to implement the wait time
		g.wait(5000, function () {
			tank.missle_reloadFinish_flag = true;
		});

		launch_missileSound.play(); // this will play the missile sound!
		g.wait(1000, function () {
			missile_reloading_sound.play();
		});

	} else if(tank.switch_ammo_flag == -1) {    //tankA.halfWidth
		console.log(tank.name + "fire with red dot");

		//dont know why * 6, just trial and error...
		g.shoot(tank,tank.rotation - Math.PI/2,0,-44,g.stage,3,bullets,
				function() {

					return g.circle(10,"grey");
				});

		normal_bullets_launchSound.play();
	}
}

