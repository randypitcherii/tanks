var x = SCREEN_W/2,y = SCREEN_H/2;

var man,apple,bg;
var grass;

var player_x = 320; 
var player_y = 240;

angle_clock = 0;

function draw()
{
	//textout(canvas,font,"Hello World!",x,y,24,makecol(0,0,0));
	//simple_blit(grass,
	console.log(player_x + " " + player_y);
	rotate_sprite(canvas,man,player_x,player_y,angle_clock);

}

function update()
{
	if(key[KEY_UP] || key[KEY_W]) {
		// the player head should not exit the screen if you are below 16, if u put '0' half of the body can go out of the screen
		if(player_y > 16) {
		player_y = player_y - 4;
		//console.log("here");
		}
	} 

	if(key[KEY_DOWN] || key[KEY_S]) {
		if(player_y < 464)  {
		player_y = player_y + 4;
		}
	}
	//rotation
	if(released[KEY_A]) {
		//stop_sample(man);
	} else 
	if(key[KEY_A] || key[KEY_UP]) {

		angle_clock = angle_clock + 90;
	} 
	
	
}

function main()
{
	//enable_debug('debug');
	allegro_init_all("game_canvas", 640, 480);
	console.log(SCREEN_W + " " + SCREEN_H);
	man = load_bmp("man.png");
	grass = load_bmp("grass.jpg");
	//apple = load_bmp("apple.png");
	ready(function(){
		loop(function(){
			clear_to_color(canvas,makecol(255,255,255));
			update();
			draw();
		},BPS_TO_TIMER(30));
	});
	return 0;
}
END_OF_MAIN();

 