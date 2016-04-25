"use strict";

var thingsToLoad = ["../images/switch_ammo_button.png","../images/right_arrow.png","../images/left_arrow.png","../images/down_arrow.png","../images/up_arrow.png","../images/wall.jpg","../sounds/explosion.mp3","../images/dynamite.png","../images/explorer.png","../fonts/emulogic.ttf","../images/dungeon.png","../images/explosion.jpeg","../images/blob.png","../images/door.png","../images/bunny.png","../sounds/launch_missile.mp3","../sounds/missile_heat.mp3","../sounds/normal_bullets.mp3","../sounds/bullets_hit.mp3","../images/up.png","../images/bullet.png","../images/smoke.png","../images/debris.png","../images/monster_boss.png","../sounds/missile_reloading.wav","../images/start_button.png","../images/restart_button.png"];

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
    healthBar_tankB_prev = undefined,
    walls = undefined,
    control_gui = undefined;


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
	background = g.rectangle(400, 400, "yellow");
	tankA = g.rectangle(32, 32, "green"), turretA = g.line("red", 10, 0, 0, 32, 0);
	tankA.setPivot(0.5,0.5);
	tankA.name = "tankA";
	tankA.addChild(turretA);
	turretA.x = 0;
	turretA.y = 0;

	//control_gui = g.rectangle(400,112,"green");
	//control_gui.setPivot(0,0);
	//control_gui.setPosition(400,400);
	//g.stage.putBottom(control_gui);

	//g.stage.putBottom(tankA);
	background.putBottom(tankA);

	//background.putBottom(tankA);
	//tankA.rotation = 3/2 * Math.PI;
	turretA.rotation = 3/2 * Math.PI;
	//console.log("turretA rotation is " + turretA.rotation);
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
	//gameScene.addChild(tankB);
	background.putTop(tankB,0,32);

	//g.stage.putTop(tankB);
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

	healthBar_tankA.x = background.width - tankA_outerBar.width;
	healthBar_tankA.y = background.height - tankA_outerBar.height;


	//background.putBottom(healthBar_tankB,40,-tankB_outerBar.height);
	//g.stage.putBottom(healthBar_tankB,0,0);
	background.putRight(healthBar_tankB,0,background.height/2 - 8);
	background.putRight(healthBar_tankA,0,-background.height/2 + 8);
	//healthBar_tankB.x = g.stage.width - tankA_outerBar.width;
	//healthBar_tankB.y = g.stage.height - tankA_outerBar.height;

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

	//createWall();
	initTankControls();    

	/*
	   FOR MOBILE
	   */
	var forward_button = g.button([
			"../images/up_arrow.png",
			]);
	//forward_button.width = 40;
	forward_button.height = 40;
	forward_button.press = () => {
		console.log("state is " + forward_button.state);
		tankA.rotation = 0;
		tankA.vy = -5;
		tankA.vx = 0;
		//console.log("the button width is " + forward_button.width);
	};
	forward_button.release = () => {
		if (!down_button.isDown && tankA.vx === 0) {
			tankA.vy = 0;

		}
	};
	forward_button.setPosition(120,410);

	var left_button = g.button([
			"../images/left_arrow.png",
			]);
	left_button.width = 78;
	left_button.height = 40;
	left_button.press = () => {
		tankA.rotation = 270 / 180 * Math.PI;

		//Change the player's velocity when the key is pressed.
		tankA.vx = -5;
		tankA.vy = 0;
		console.log("state is " + left_button.state);
	};

	left_button.release = function() {
		//If the left arrow has been released, and the right arrow isn't down,
		//and the player isn't moving vertically:
		//Stop the player.
		if (!right_button.isDown && tankA.vy === 0) {
			tankA.vx = 0;
		}
	};
	left_button.setPosition(22,460);

	var right_button = g.button([
			"../images/right_arrow.png",
			]);
	right_button.width = 78;
	right_button.height = 40;
	right_button.press = () => {
		tankA.rotation = 0.5 * Math.PI;
		tankA.vx = 5;
		tankA.vy = 0;
		console.log("state is " + right_button.state);
	};

	right_button.release = function () {
		if (!right_button.isDown && tankA.vy === 0) {
			tankA.vx = 0;
		}
	};

	right_button.setPosition(208,460);

	var down_button = g.button([
			"../images/down_arrow.png",
			]);
	down_button.width = 78;
	down_button.height = 40;
	down_button.press = () => {
		tankA.rotation = Math.PI;
		tankA.vy = 5;
		tankA.vx = 0;
	};

	down_button.release = () => {
		if (!forward_button.isDown && tankA.vx === 0) {
			tankA.vy = 0;
		}
	};
	//down_button.setPosition(80,g.stage.height - 60);
	down_button.setPosition(120,460);

	background.interact = true;

	background.press = () => {
		fire(tankA);
	};

	var change_ammo_button = g.button([
			"../images/switch_ammo_button.png",
			]);
	//change_ammo_button.width = 120;
	change_ammo_button.height = 40;
	change_ammo_button.press = () => {
		console.log("u tapped the change ammo button");
		tankA.switch_ammo_flag *= -1;
	};
	//right_button.setPosition(130,g.stage.height - 70);
	change_ammo_button.setPosition(380,460);

	g.state = play;


}

function play() {
	//console.log("the rotation in playing mode " + turretA.rotation);
	/*
	   let tankA_wall_collision = g.hit(tankA, walls, true, false, false,
	   function(collision, platform) {
	   if (collision == "right") {
	//tankA.vx = 0;
	} else if (collision == "left") {
	//tankA.vy = 0;
	}
	console.log("collsiion side is " + collision);
	}
	);
	let tankB_wall_collision = g.hit(tankB, walls, true, false, false,
	function(collision, platform) {
	if (collision == "right") {
	//tankB.vx = 0;
	} else if (collision == "left") {
	//tankB.vy = 0;
	}
	console.log("collsiion side is " + collision);
	}
	);
	*/
	g.move(tankA);
	g.move(tankB);
	//g.move(bullets); 

	g.contain(tankA, background);
	g.contain(turretA, background);
	g.contain(tankB, background);
	g.contain(turretB, background);


	/*
	   collision detection for bullets and tanks
	   */
	bullets = bullets.filter(function (bullet) {

		//Move the bullet
		g.move(bullet);
		if(bullet.x > background.width || bullet.x <= 0 || bullet.y > background.height || bullet.y <= 0) {
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
			var damage = -5;
			//console.log("damage done is " + (healthBar_tankB.inner.width + damage));
			if(healthBar_tankB.inner.width + damage <= 0) {
				healthBar_tankB.inner.width = 0;
			} else {
				healthBar_tankB.inner.width += damage;
			}
			normal_bullets_hitSound.play();
			g.createParticles(tankB.x, tankB.y, function () {
				return g.sprite("../images/debris.png");
			}, g.stage, 50);

			//Remove the bullet from the `bullets` array
			return false;
		} else if (g.hitTestRectangle(tankA,bullet)) {
			g.remove(bullet);
			console.log("hitted with red dot");
			var damage = -5;
			//console.log("damage done is " + (healthBar_tankB.inner.width + damage));
			if(healthBar_tankA.inner.width + damage <= 0) {
				healthBar_tankA.inner.width = 0;
			} else {
				healthBar_tankA.inner.width += damage;
			}
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
		if(fire_bullet.x > background.width || fire_bullet.x <= 0 || fire_bullet.y > background.height || fire_bullet.y <= 0) {
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
			var damage = -25;
			//console.log("damage done is " + (healthBar_tankB.inner.width + damage));
			if(healthBar_tankB.inner.width + damage <= 0) {
				healthBar_tankB.inner.width = 0;
			} else {
				healthBar_tankB.inner.width += damage;
			}
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
			var damage = -25;

			if(healthBar_tankA.inner.width + damage <= 0) {
				healthBar_tankA.inner.width = 0;
			} else {
				healthBar_tankA.inner.width += damage;
			}
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

	/*
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
	   */

	healthBar_tankA_prev = healthBar_tankA.inner.width
		healthBar_tankB_prev = healthBar_tankB.inner.width;



}

/*
   Function for ending the game 
   */
function end(message) {
	//message ="what"
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
	g.remove(walls);


	//background.putBottom(tankA,background.width/2,tankA.height);
	//g.stage.putBottom(tankA,-70,-tankA.height);
	//background.putBottom(tankB,background.width/2,tankA.height);
	// g.stage.putTop(tankB,-70,tankB.height + 5);
	g.remove(bullets);
	g.remove(fire_bullets);
	// g.remove(aliens);
	//g.remove(walls);
	//dust.stop();
	createWall();



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
function createWall() {
	walls = [];

	// NUBMER 2 wall
	for (var i = 0; i < 40; i++) {
		//let wall = g.sprite("../images/wall.jpg");
		let wall =  g.rectangle(2,2, "brown");
		let x = 1/4*g.stage.width;
		// avoding collision

		// let y = g.randomInt(0,0);
		let y = (1/4*g.stage.height) + 6 * i;
		wall.x = x;
		wall.y = y
			walls.push(wall);

	}
	// NUMBER 3 wall
	for (var i = 0; i < 40; i++) {
		let wall =  g.rectangle(2,2, "brown");
		let x = 1/4*g.stage.width + 8;
		let y = (1/4*g.stage.height) + 6 * i;
		wall.x = x;
		wall.y = y
			walls.push(wall);
	}

	//NUMBER 6 wall
	for (var i = 0; i < 40; i++) {
		let wall =  g.rectangle(2,2, "brown");

		let x = g.stage.width - (g.stage.width*1/4);
		// avoding collision

		// let y = g.randomInt(0,0);
		let y = (1/4*g.stage.height) + 6 * i;
		wall.x = x;
		wall.y = y
			walls.push(wall);

	}
	// console.log("walls length is " + walls.length );
	// NUMBER 7  wall
	for (var i = 0; i < 40; i++) {
		let wall =  g.rectangle(2,2, "brown");
		let x = g.stage.width - (g.stage.width*1/4) - 8;
		let y = (1/4*g.stage.height) + 6 * i;
		wall.x = x;
		wall.y = y
			walls.push(wall);
	}
	for (var i = 0; i < 40; i++) {
		let wall =  g.rectangle(2,2, "brown");
		let x = g.stage.width - (g.stage.width*1/4) - 8;
		let y = (1/4*g.stage.height) + 6 * i;
		wall.x = x;
		wall.y = y
			walls.push(wall);
	}




}

