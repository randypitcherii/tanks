"use strict";



var thingsToLoad = ["images/explorer.png","fonts/emulogic.ttf","images/dungeon.png","images/blob.png","images/door.png","images/bunny.png"];

var g = hexi(520,520,setup,thingsToLoad,load);

g.scaleToWindow();
g.start();


var cannon = undefined,
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
gameOverMessage = undefined;

var switch_ammo_flag = 1;

// this loads stuff before the games start making sure everything is loading properly before starting
function load() {
  g.loadingBar();
}

function setup() {
  var background = g.sprite("images/dungeon.png");

  cannon = g.sprite("images/explorer.png");

  g.stage.putBottom(cannon,0,-40); // this puts x = 0 but 40 above the y
  

  //setting up the bullets array (a lot of it ! ) variable
  bullets = [];

  //a lot of aliens variable!
  aliens = [];

  scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);

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
      console.log("f is pressed");  
      switch_ammo_flag *= -1;
  };

  //Left arrow key.
  //Assign key `press` method.
  left.press = function() {
    console.log("left key pressed");
     //Change the player's velocity when the key is pressed.
     cannon.vx = -5;
     cannon.vy = 0;
 };
   //Assign key `release` method.
   left.release = function() {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the player isn't moving vertically:
    //Stop the player.
    if (!right.isDown && cannon.vy === 0) {
      cannon.vx = 0;
  }
};


  //Left arrow key.
  //Assign key `press` method.

  //Right arrow key.
  //Assign key `press` method.
  right.press = function () {
    cannon.vx = 5;
    cannon.vy = 0;
};

  //Assign key `release` method.
  right.release = function () {
    if (!left.isDown && cannon.vy === 0) {
      cannon.vx = 0;
  }
};

  //up key
  up.press = () => {
    cannon.vy = -5;
    cannon.vx = 0;
};

up.release = () => {
 if (!down.isDown && cannon.vx === 0) {
   cannon.vy = 0;
}
};
 //Down
 down.press = () => {
  cannon.vy = 5;
  cannon.vx = 0;
};
down.release = () => {
   if (!up.isDown && cannon.vx === 0) {
     cannon.vy = 0;
 }
};

//when space button is pressed FIRE AWAY!
space.press = function() {
    if(switch_ammo_flag == 1) {
      g.shoot(cannon,4.71,cannon.halfWidth,0,g.stage,7,bullets, function() {
       // return g.sprite("images/bunny.png");
       return g.sprite("images/line.png");
   });
  } else {
    g.shoot(cannon,4.71,cannon.halfWidth,0,g.stage,3,bullets, function() {
     return g.sprite("images/bunny.png");
 });
}
    // can play shooting sound here if u want when the space key is pressed!
};

g.state = play;

score = 0;
scoreNeededToWin = 60;
alienTimer = 0;
alienFrequency = 100;
winner = "";

}



function play() {
  g.contain(cannon,g.stage);
  g.move(cannon);
  g.move(bullets); // this is enough to move the bullets straight eh!
  g.contain(cannon,g.stage);

  alienTimer++;
  // this is to slowly spawn aliens
  if(alienTimer === alienFrequency) {
    var alienFrames = ["images/blob.png"]; // can add more frames so that what should it appear when it dies 
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
    bullets = bullets.filter(function (bullet) {

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



}














