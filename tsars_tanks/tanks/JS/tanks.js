"use strict";

var thingsToLoad = ["../images/explorer.png","../fonts/emulogic.ttf","../images/dungeon.png",
"../images/blob.png","../images/door.png","../images/bunny.png","../sounds/launch_missile.mp3","../sounds/missile_heat.mp3","../sounds/normal_bullets.mp3","../sounds/bullets_hit.mp3","../images/up.png","../images/bullet.png"];

var g = hexi(640,640,setup,thingsToLoad,load);

g.scaleToWindow();
//scaleToWindow(g.view);
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
bunny = undefined,
launch_missileSound = undefined,
missile_hitSound = undefined,
normal_bullets_launchSound = undefined,
normal_bullets_hitSound = undefined,
background = undefined,
outerBar = undefined,
innerBar = undefined,
healthBar = undefined,
fire_bullet = undefined;

var missile_reloading_timer = undefined;
var missle_reloadFinish_flag = true;

var pointer = undefined;

var switch_ammo_flag = 1;

// this loads stuff before the games start making sure everything is loading properly before starting
function load() {
	g.loadingBar();
}

function setup() {
	background = g.sprite("../images/dungeon.png");

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

	g.stage.putBottom(tankA,-70,-tankA.height);
	g.stage.putTop(tankB,-70,tankB.height + 5);

	//creating the health bar
	outerBar = g.rectangle(128, 16, "black"),
	innerBar = g.rectangle(128, 16, "red");

	healthBar = g.group(outerBar, innerBar);
	healthBar.inner = innerBar;

	healthBar.x = g.canvas.width - 128;
	healthBar.y = 0;

    // end of creating health bar





    //setting up the bullets array (a lot of it ! ) variable
    bullets = [];

    //a lot of aliens variable!
    aliens = [];

/*
	Loading all the sound
	*/
    //sound when missile is launcehd NOTE: this is only just creating it not playing!
    launch_missileSound = g.sound("../sounds/launch_missile.mp3");
    launch_missileSound.volume = 0.1;
    missile_hitSound = g.sound("../sounds/missile_heat.mp3");
    normal_bullets_launchSound = g.sound("../sounds/normal_bullets.mp3");
    normal_bullets_launchSound.volume = 0.1;
    normal_bullets_hitSound = g.sound("../sounds/bullets_hit.mp3")

    scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);

    missile_reloading_timer = 0;

    // music?


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
	switch_ammo_flag *= -1;
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
    space.press = function() {
    	if(switch_ammo_flag == 1 && missle_reloadFinish_flag == true) {
    		g.shoot(tankA,tankA.rotation - Math.PI/2,0,0,g.stage,7,bullets,
    			function() {
    				fire_bullet = g.sprite("../images/bullet.png");
    				fire_bullet.width = tankA.width ;
    				fire_bullet.height = tankA.height ;
    				fire_bullet.rotation = tankA.rotation;

    				return fire_bullet;
    			});
    		missle_reloadFinish_flag = false;
    		//trying to implement the wait time
    		g.wait(3000, function () {
    			missle_reloadFinish_flag = true;
    		});
    		launch_missileSound.play(); // this will play the missile sound!
    	} else if(switch_ammo_flag == -1) {	//tankA.halfWidth
    		g.shoot(tankA,tankA.rotation - Math.PI/2,tankA.width * 5/6,0,g.stage,3,bullets,
    			function() {

    				//bunny = g.sprite("../images/bunny.png");
			//bunny.width = tankA.width ;
			//bunny.height = tankA.height ;
			//bunny.rotation = tankA.rotation;
			return g.circle(8,"red");
				//return bunny;
			});
    		normal_bullets_launchSound.play();
    	}
	// can play shooting sound here if u want when the space key is pressed!
};


/*
  FOR MOBILE
  */
  var forward_button = g.button([
  	"../images/up.png",
  	]);
  forward_button.width = 40;
  forward_button.height = 40;
  forward_button.press = () => {
  	console.log("state is " + forward_button.state);
  	tankA.rotation = 0;
  	tankA.vy = -5;
  	tankA.vx = 0;
  };
  forward_button.release = () => {
  	if (!down_button.isDown && tankA.vx === 0) {
  		tankA.vy = 0;
  	}
  };
  forward_button.setPosition(80,g.stage.height - 120);

  var left_button = g.button([
  	"../images/up.png",
  	]);
  left_button.width = 40;
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

left_button.setPosition(20,g.stage.height - 60);

var right_button = g.button([
	"../images/up.png",
	]);
right_button.width = 40;
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

right_button.setPosition(140,g.stage.height - 60);

var down_button = g.button([
	"../images/up.png",
	]);
down_button.width = 40;
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
down_button.setPosition(80,g.stage.height - 60);

g.pointer.tap = () => {

	if(forward_button.state == "up" && down_button.state == "up" && left_button.state == "up" && right_button.state == "up" && switch_ammo_flag == 1 && missle_reloadFinish_flag == true) {
		g.shoot(tankA,tankA.rotation - Math.PI/2,0,0,g.stage,7,bullets,
			function() {
				fire_bullet = g.sprite("../images/bullet.png");
				fire_bullet.width = tankA.width ;
				fire_bullet.height = tankA.height ;
				fire_bullet.rotation = tankA.rotation;

				return fire_bullet;
			});
		missle_reloadFinish_flag = false;
    		//trying to implement the wait time
    		g.wait(3000, function () {
    			missle_reloadFinish_flag = true;
    		});
    		launch_missileSound.play();  
    	} else if(forward_button.state == "up" && down_button.state == "up" && left_button.state == "up" && right_button.state == "up" && switch_ammo_flag == -1) {
    		g.shoot(tankA,tankA.rotation - Math.PI/2,tankA.width * 5/6,0,g.stage,3,bullets,
    			function() {

    				//bunny = g.sprite("../images/bunny.png");
			//bunny.width = tankA.width ;
			//bunny.height = tankA.height ;
			//bunny.rotation = tankA.rotation;
			return g.circle(8,"red");
				//return bunny;
			});
    		normal_bullets_launchSound.play();
    	}
    };

/*
END OF FOR MOBILE VERSION
*/

g.state = play;

score = 0;
scoreNeededToWin = 60;
alienTimer = 0;
alienFrequency = 100;
winner = "";
}



function play() {
	g.contain(tankA,background);
	g.move(tankA);
	g.move(bullets); 
	//g.contain(tankA,g.stage);

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

	//checking for collision between bullets and tanks

	bullets = bullets.filter(
		function (bullet) {
			//there is a hit on one of the type of bullets
			if(bullet.y > background.height - bullet.height || bullet.x > background.width - bullet.width) {
				g.remove(bullet);
				bullet.vy = 0;
				return false;
			}
			if (g.hitTestRectangle(tankB,bullet)) {
				g.remove(bullet);
				if(switch_ammo_flag == 1) { // this is for missile
					//missile_hitSound.volume = 0.1;
					missile_hitSound.play();
					healthBar.inner.width += -5;
				} else if(switch_ammo_flag == -1) {
					healthBar.inner.width += -1;
					normal_bullets_hitSound.play();
				}
				return false; //removing bullets from the function
			} else {
				return true;
			}
		});


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
		/*
		g.wait(1000, function () {
			return g.remove(alien);
		});
	*/	  g.wait(1000, () => g.remove(alien));

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
//checking when aliens reaches the background
aliens = aliens.filter(function (alien) {
	var alien_alive = true;
	if(alien.y > background.height - alien.height) {
		alien_alive = false;
			//g.wait(1000, () => g.remove(alien));
			g.remove(alien);
		};
		return alien_alive;

	});

/*
//checking when bullets reaches the background
bullets = bullets.filter(function (bullet) {
	var bullets_alive = true;
	if(bullets.y < background.height - bullets.height) {
			bullets_alive = false;
			//g.wait(1000, () => g.remove(alien));
			g.remove(bullet);
		};
		return bullets_alive;

	});
*/

}












