score_sound = new Audio("score.wav");
player_death = new Audio("player_death.wav");
player_shot = new Audio("player_shot.wav");
op_death = new Audio("op_death.wav");
opfor_beam = new Audio("opfor_beam.wav");


gameSong = new Audio("little_loop.wav");
gameSong.addEventListener('ended', function(){
		this.currentTime=0;
		this.play();
}, false);



document.onkeydown = function(k){
	
	switch(k.keyCode){

			
		case 90:
			player.update_status('shooting',player.facing);
			player.spawn_bullet();
			break;
		case 39:
			if(player.action == 'jumping'){
				player.update_status('jumping','right');
				break;
			}
			player.update_status('running','right');
			break;
		case 37:
			if(player.action == 'jumping'){
				player.update_status('jumping','left');
				break;
			}
			player.update_status('running','left');
			break;
		case 38:
			if(player.action == 'jumping'){
				break;
			}
			player.update_status('jumping',player.facing);
			break;
		case 13:
			if(!g.is_inLoop){
				g.init();
				break;
			};
		default:

	};
};
document.onkeyup = function(k){
	player.update_status('standing',player.facing);
};

function O_robot(name, html_id){
	this.sprite_sheet = "shooter.png";
	this.name = name;
	this.html_id = html_id;
	this.health = 100;
	this.x_pos = 200;
	this.y_pos = 410;
	this.falling = false;
	this.action = 'standing';
	this.facing = 'right';
	this.b_facing = 'right';
	this.b_action = 'pulse';
	this.b_active = 0;
	this.bx_pos = 0;
	this.by_pos = 0;
	this.hitbox = { 'height': 100,
					'width': 60};
	this.bullet_hitbox = { 'height': 30,
							'width': 40};
	var b_counter = 0;

	var counter = 0;
	var action_right = {
		'standing': {'y': 0 , 'x': [0,1,2,1]},
		'shooting': {'y': 2 , 'x': [0,1,2,3,2,3]},
		'running': {'y': 1 , 'x': [0,1,2,3,4,5,6,7,8,9]},
		'jumping': {'y': 4 , 'x': [0,1,2,1,2,1,2,1,2,1,2]},
		'falling': {'y': 4, 'x':[6,6,7,7,6,6,7,7,6,7]}

	};
	var action_left = {
		'standing': {'y': 0 , 'x': [3,4,5,4]},
		'shooting': {'y': 2 , 'x': [7,6,5,4,5,4]},
		'running': {'y': 3 , 'x': [9,8,7,6,5,4,3,2,1,0]},
		'jumping': {'y': 4 , 'x': [5,4,3,4,3,4,3,4,3,4,3]},
		'falling': {'y': 4, 'x':[8,8,9,9,8,8,9,9,8,9]}
	};
	this.spawn = function(sy,sx){
		this.box = document.createElement("DIV");
		this.box.height = 95;
		this.box.width = 95;
		this.box.id = this.name;
		document.body.appendChild(this.box);
		$("#"+this.name).css('background', "url('shooter.png') 0px 0px").css('top', sy+'px').css('left', sx+'px');	
	};
	this.drawSprite = function(top,left){
		$("#"+this.name).css('background', "url('shooter.png') "+left*(-100)+"px "+top*(-100)+"px").css('left', this.x_pos+"px").css('top', this.y_pos+"px");
	};
	this.update_status = function(action, facing){
		//counter=0;
		this.action = action;
		this.facing = facing;
	};
	this.move =function(action, facing){
		
		var allow_xl = allow_xr = allow_yd =allow_yu = true;
		if(this.x_pos > 910){allow_xr = false;};
		if(this.x_pos < 10){allow_xl = false;}; 
		if(this.y_pos > 590){allow_yd = false;};
		if(this.y_pos < 10){allow_yu = false;};
		this.count(this.action);
		//console.log(allow_xr,allow_xl);
		//if(allow_x){};
		//if(allow_y){};
		if(this.falling){
			this.action = 'falling';
			if(allow_yd){this.y_pos +=15;};
		}else
			if(action == 'jumping'){
				
				if(counter == 0){
					this.action = 'standing';
				}
				if(facing == 'right'){
					if(allow_xr){this.x_pos +=15;};
					this.y_pos -=10;
				}else if(facing =='left'){
					if(allow_xl){this.x_pos -=15;};
					this.y_pos -=10;			
				}else{
					this.y_pos -=15;
				}
			}else{
				//this.count(this.action);
				if(counter == 0){
					this.action = 'standing';
				}
				if(action == 'running'){
					if(facing == 'right'){
						if(allow_xr){this.x_pos +=15;};
					}else if(facing =='left'){
						if(allow_xl){this.x_pos -=15;};
					}
				}
			};
		
	};
	this.count = function(action){
		if(action == 'jumping'){
			if(counter >9){
				counter = 2;
				
			}
		}else
		if(action == 'running'){
			if(counter > 9){
				counter=2;
				
			}
		}else if(action == 'shooting'){
			if(counter > 6){
				counter=2;
				
			}
		}else if(action == 'falling'){
			if(counter > 9){
				counter = 0;
			}
		}
		else{
				if(counter>3){
					counter=0;
					
				}
			}
		
	};
	this.re_crop = function(){

		
 		if(this.facing == 'right'){
 			this.drawSprite(action_right[this.action].y, action_right[this.action].x[counter++]);
 		}else if(this.facing == 'left'){
 			this.drawSprite(action_left[this.action].y, action_left[this.action].x[counter++]);
 		}
		this.move(this.action,this.facing);
		
	};
	var bullet_action = {
		'death': {'y': 1 , 'x':[0,1,2,3]},
		'pulse': {'y': 0 , 'x':[0,1,2,3,2,1]}
	}
	this.spawn_bullet = function(){
		if(this.b_active == 0){
			this.b_action = 'pulse';
		this.bx_pos = 0;
		this.by_pos = 0;
		this.box = document.createElement("DIV");
		this.box.height = 40;
		this.box.width = 40;
		this.box.id = 'bullet';
		document.body.appendChild(this.box);
		this.by_pos = this.y_pos;
		if(this.facing == 'right'){
			this.bx_pos = this.x_pos+70;
			}else{
				this.bx_pos = this.x_pos;
			}	

		$("#"+'bullet').css('background', "url('shooter_bullet.png') 0px " + this.bx_pos +"px").css('left', this.bx_pos + "px").css('top', this.by_pos+30+"px").css('height','40px').css('width','40px');	
		this.b_active = 1;
		this.b_facing = this.facing;
		player_shot.play();
		
		
		};

	};
	this.destroy_bullet = function(){
		if(b_counter>4){
			document.body.removeChild(document.getElementById('bullet'));
			this.b_active = 0;
			b_counter = 0;
			this.bx_pos = 0;
			this.by_pos = 0;
			
		}
		this.draw_bullet(bullet_action[this.b_action].y, bullet_action[this.b_action].x[b_counter++]);
		
	};
	this.cycle_bullet = function(){
		if(b_counter>6){
			b_counter = 0;
		}
		if(this.b_facing == 'right'){
			this.bx_pos +=20;
		}else{
			this.bx_pos -= 20;
		}
		if(this.bx_pos > 950 || this.bx_pos < 25){
			this.b_action = 'death';
		}
	};
	this.move_bullet = function(){
		this.draw_bullet(bullet_action['pulse'].y, bullet_action['pulse'].x[b_counter++]);
		this.cycle_bullet();
	};
	this.draw_bullet = function(top,left){
		$("#"+'bullet').css('background', "url('shooter_bullet.png') "+left*(-40)+"px "+top*(-40)+"px").css('left', this.bx_pos+"px");
	};
	this.game_func = function(){
		this.re_crop();
		if(this.b_active){
			if(this.b_action == 'death'){
				this.destroy_bullet();
			}else{
				this.move_bullet();
			};
		};
	};
};

function opfor(name, html_id, idnum){
	this.id = html_id;
	this.name = name;
	this.idnum = idnum;
	this.x_pos = 0;
	this.y_pos = 0;
	var counter = 0;
	var d_counter = 0;
	this.hitbox = {'height': 90,
					'width': 70};
	
	var facing = 'right';
	if(Math.random() > .5){
		facing = 'left';
	};				
	
	this.falling = true;
	this.is_shooting = false;
	this.action = "running";
	this.spawn = function(sx,sy){
		this.box = document.createElement("DIV");
		this.box.height = 95;
		this.box.width = 95;
		this.x_pos = sx;
		this.y_pos = sy;
		this.box.id = html_id;
		document.body.appendChild(this.box);
		$("#"+this.id).css('background', "url('shooter_opfor.png') 0px 0px").css('width', '100px').css('height', '100px').css('display','inline-block').css('position','absolute').css('left',sx+"px").css('top',sy+"px");	
	};
	var right_action ={
		'standing': {'y': 0 , 'x': [0,0,0,0,0,0,0,0,2,0,0,0]},
		'running': {'y': 2 , 'x': [0,1,2,3,4,5,6]},
		'shooting': {'y': 4, 'x': [7,6,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,6,7]}
	}
	var left_action = {
		'standing': {'y': 0 , 'x': [0,0,0,0,0,0,0,0,0,0,2,0]},
		'running': {'y': 1 , 'x': [0,1,2,3,4,5,6]},
		'shooting': {'y': 4, 'x': [0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1]}
	};
	var misc_action = {
		'death': {'y': 3 , 'x': [0,1,2,3,4,5,6,7,8,9]}
	}
	var beam_action = {
		'pulse': {'y': [1,7,3,12,19,0] , 'x':0}
	};
	this.b_counter = 0;
	this.b_action = 'pulse';
	this.b_active = 0;
	this.b_facing = this.facing;
	this.b_cooldown = 0;
	this.b_timer = 0;
	this.drawSprite = function(top,left){
		$("#"+this.id).css('background', "url('shooter_opfor.png') "+left*(-100)+"px "+top*(-100)+"px").css('left', this.x_pos+"px").css('top', this.y_pos+"px").css('z-index','3');
	};
	this.destroy_beam = function(id){
		//if(document.getElementById(id)){
			try{
				document.body.removeChild(document.getElementById(this.bbox.id));
				this.bx_pos = 0;
				this.by_pos = 0;
			}catch(err){
				console.log('no beam!');
			};
			//$('#'+this.bbox.id).each().remove();
			this.b_active = 0;
			this.b_timer = 0;
			this.b_cooldown = 100;
		//};
		
	};
	this.spawn_beam = function(){
		this.bx_pos = 0;
		this.by_pos = 0;
		this.bbox = document.createElement("DIV");
		this.bbox.height = 40;
		this.bbox.width = 900;
		this.bbox.id = 'beam'+this.name;
		document.body.appendChild(this.bbox);
		this.by_pos = this.y_pos;
		if(facing == 'right'){
			this.bx_pos = this.x_pos+50;
			//console.log(this.bx_pos);
			/*""+ this.bx_pos +"px*/
			$("#"+this.bbox.id).css('background', "url('shooter_beam.png') 0px 200px").css('left', this.bx_pos + "px").css('top', this.by_pos+25+"px").css('height','5px').css('width',990-this.x_pos + 'px').addClass('.beam').css('position', 'absolute');
		}else{
			this.bx_pos = this.x_pos-860;
			//console.log(this.bx_pos);
			/*"+ this.bx_pos +"px*/
			$("#"+this.bbox.id).css('background', "url('shooter_beam.png') 0px 200px").css('left', this.bx_pos + "px").css('top', this.by_pos+25+"px").css('height','5px').css('width','900px').addClass('.beam').css('position', 'absolute');
		}	
		this.b_active = 1;
		this.b_facing = facing;
		opfor_beam.play();
	};
	this.beam = function(top,left){
		if(this.b_counter > 13){
			this.destroy_beam(this.bbox.id);
			this.b_coutner = 0;
		}else{
			//console.log($("#"+'beam'+this.name).css('background', "url('shooter_beam.png') "+left+"px "+top*(-10)+"px"));
			$("#"+'beam'+this.name).css('background', "url('shooter_beam.png') "+left+"px "+top*(-10)+"px");
		};
		
	};
	this.beam_pass = function(){
		if(this.b_timer++ > 5){
			if(this.b_active){
					this.beam(beam_action[this.b_action].y[this.b_counter++], beam_action[this.b_action].x);
					//this.beam(this.b_counter,0);
				}else{
				this.spawn_beam();
				};
			/*if(this.b_counter++ > 3){
				
			};*/
		};
	};
	this.detect_player = function(){
		//console.log(player.y_pos+player.hitbox['height'],this.y_pos-20);
		//console.log(player.y_pos,this.y_pos+this.hitbox['height']+20);
		if((player.y_pos+player.hitbox['height'] < this.y_pos+20)||(player.y_pos > this.y_pos+this.hitbox['height']-20)||this.falling || this.b_cooldown > 0){
			this.is_shooting = false;
			this.action = 'running';
			this.b_cooldown--;
			return;
		}else{
			if(player.x_pos > this.x_pos){
				facing = 'right';
			}else{
				facing = 'left';
			}
			this.action = 'shooting';
			//this.b_active = 1;
			this.is_shooting = true;

		};
	};
	this.update = function(){
		
		//console.log(this.action,right_action[this.action].x.length);
		if(this.action == 'death'){
			/*
			if($('#'+this.bbox.id).length > 0){
				this.destroy_beam(this.bbox.id);
			}*/
			var trash = document.getElementById('beam'+this.name);
			if(trash != null){
				this.destroy_beam(this.bbox.id);
			};
			try{
				$("#"+'beam'+this.name).remove();
			}catch(err){
				console.log("no Beam!");
			};
			this.is_shooting = false;
			//console.log(this.name, this.action, this.id, counter, d_counter);
			//for(var z in g.opfor_team){
				
				//console.log(g.opfor_team[z]);
			//};
			if(d_counter >= misc_action[this.action].x.length){
				d_counter = 0;
				this.x_pos = -100;
				this.y_pos = -100;
				this.hitbox['height'] = 0;
				this.hitbox['width'] = 0;
				this.action = 'dead';
				
				//console.log(this.name);	
				
				$("#"+this.id).remove();
				
			}else{
				this.drawSprite(misc_action[this.action].y, misc_action[this.action].x[d_counter++]);
				return;
			};
		}else if(this.action == 'shooting' && this.is_shooting){
			
				this.beam_pass();
				
			
			if(facing == 'right'){
				if(counter >= right_action[this.action].x.length){
					counter = 0;
					this.is_shooting = false;
					
				};
				this.drawSprite(right_action[this.action].y, right_action[this.action].x[counter++]);
				return;
			}else if(counter >= left_action[this.action].x.length){
					counter = 0;
					this.is_shooting = false;
					
				};
				this.drawSprite(left_action[this.action].y, left_action[this.action].x[counter++]);
				return;

		}else{

				var allow_xl = allow_xr = allow_yd =allow_yu = true;
				if(this.x_pos > 910){allow_xr = false;};
				if(this.x_pos < 10){allow_xl = false;}; 
				if(this.y_pos > 590){allow_yd = false;};
				if(this.y_pos < 10){allow_yu = false;};
				
			
				//$('#'+this.bbox.id).each().remove();
			if(this.falling){
				if(allow_yd){this.y_pos+=15;};
			}
			if(this.x_pos > 900){
				facing = 'left';
			}else if(this.x_pos < 0){
				facing = 'right';
			};

			if(facing == 'right'){
				if(counter >= right_action[this.action].x.length){
				counter = 0;
				};
				
				this.drawSprite(right_action[this.action].y, right_action[this.action].x[counter++]);
				this.x_pos += 12;
			}else{
				facing = 'left';
				if(counter >= left_action[this.action].x.length){
				counter = 0;
				};
				
				this.drawSprite(left_action[this.action].y, left_action[this.action].x[counter++]);
				this.x_pos -= 12;
			};
			if(this.y_pos > 590){this.action='death'};
		};
	};
};

function goal_thing(idnum){
	this.idnum = idnum;
	var allowedx = [2,3,4,5,6,7,2,3,4,5,6,7];
	var allowedy = [3,4,5,2,2,3,4,5,4,5,4,5];
	this.x_pos = (allowedx[Math.round(Math.random()*10)]*100); 
	this.y_pos = (allowedy[Math.round(Math.random()*10)]*100)-20;
	this.hitbox = { 'height': 40,
					'width': 40};
	console.log(this.x_pos,this.y_pos);
	this.spawn = function(){
		this.box = document.createElement("DIV");
		this.box.height = 50;
		this.box.width = 50;
		this.box.id = 'goal'+this.idnum;
		document.body.appendChild(this.box);
		$("#"+this.box.id).css('background', "url('goal_thing_test.png') 0px 0px").css('width', '50px').css('height', '50px').css('display','inline-block').css('position','absolute').css('left',this.x_pos+"px").css('top',this.y_pos+"px");
	};
	this.destroy = function(){
		try{
			document.body.removeChild(document.getElementById(this.box.id));
			this.x_pos = 0;
			this.y_pos = 0;
		}catch(err){
			console.log('no ball!');
		};
		
		
	};
	
};//end of goal_thing()


function game(){
	this.opfor_team = new Array();
	this.spawn_timer = 0;
	this.is_inLoop = false;
	this.win = false;
	m = new O_map();
	var idnum = 0;
	var goal_count = 0;
	this.player_has_ball = false;
	this.menu = function(){
		m.drawmap('menu');
		clearInterval(gamespeed);
	};
	this.init = function(){
		this.is_inLoop = true;
		gameSong.play();
		m.drawmap('map2');
		m.build_floors();
		player = new O_robot("player","robot1");
		player.spawn(m.mapinfo.map2.player_start[0],m.mapinfo.map2.player_start[1]);
		this.spawn_opfor(m.mapinfo.map2.opfor_start[0],m.mapinfo.map2.opfor_start[1]);
		this.spawn_goal();

	};
	this.gameLoop = function(){
		player.game_func();
		g.is_falling(player);
		g.team_update();
		g.is_hit();
		g.score_goal();
		g.check_net();
		g.is_playing();
		console.log(g.is_inLoop);
	};
	this.is_playing = function(){
		if(!this.is_inLoop){
			
			$('#player').remove();
			for(z in this.opfor_team){
				
				try{
					this.opfor_team[z].destroy_beam();
					$('#'+this.opfor_team[z].id).remove();
				}catch(err){
					console.log('no beams');
				};
			};
			try{
				player.destroy_bullet();
			}catch(err){
					console.log('no bullet');
				};
			m.remove_floors();
			this.opfor_team = [];

			try{
				g.thing.destroy();
			}catch(err){
				console.log('no ball!');
			}
			
			
		};
	};

	this.spawn_opfor = function(){
		this.idn = idnum++;
		var name = "ebot"+this.idn;
		
		var html_id = "opfor"+this.idn;
		name = new opfor(name,html_id,this.idn);
		name.action = 'running';
		this.opfor_team.splice(this.ind,0,name);
		
		name.spawn(m.mapinfo.map2.opfor_start[0],m.mapinfo.map2.opfor_start[1]);
	};
	this.spawn_goal = function(){
		this.idnum = idnum++;
		this.thing = 'thing'+this.idnum;
		this.thing = new goal_thing(this.idnum);

		this.thing.spawn();
		console.log(this.thing);
		console.log(this.thing.x_pos,this.thing.y_pos);

	};
	this.check_net = function(){
		net = new Object();
		net.hitbox = {'height': 70, 'width': 70};
		net.x_pos = m.mapinfo.map2.net[0];
		net.y_pos = m.mapinfo.map2.net[1];
		if(this.hit(player,0,net,0) && this.player_has_ball){
			this.win = true;
			g.is_inLoop = false;
			//alert("VICTORY!");
			this.is_playing();
			m.drawmap('victory');


		};
	};

	this.team_update = function(){
		for(z in g.opfor_team){
			g.is_falling(g.opfor_team[z]);
		};
		for(var zz in this.opfor_team){
			if(this.opfor_team[zz].action !='dead'){
				this.opfor_team[zz].update();
			};
		};
		for(var zzz in this.opfor_team){
			if(this.opfor_team[zzz].action !='dead' && this.opfor_team[zzz].action != 'death'){
				this.opfor_team[zzz].detect_player();
			};
		};
		this.f_spawn_timer();
	};
	this.f_spawn_timer = function(){
		if(this.spawn_timer++>30){
			this.spawn_opfor();
			this.spawn_timer = 0;
		};
	};
	this.hit = function(item1,isbullet,item2,isbeam){
		if(isbullet == 1){
			var test_box1 = item1.bullet_hitbox;
			var x1 = item1.bx_pos;
			var y1 = item1.by_pos;
		}else{
			var test_box1 = item1.hitbox;
			var x1 = item1.x_pos;
			var y1 = item1.y_pos;
		};
		if(isbeam == 1){
			return true;
			var test_box2 = {'height': 10,
					'width': 0};
			var x2 = 1000;
			var y2 = item1.by_pos;
		}else{
			var test_box2 = item2.hitbox;
			var x2 = item2.x_pos;
			var y2 = item2.y_pos;
		}
		//if(item2 == g.thing){console.log(x1,x2,' :: ',y1,y2);};
		//console.log(item1,item2);
		if((x1 >= x2+test_box2['width'])||(x1 <= x2)){
			return false;
		}
		if((y1 >= y2+test_box2['height'])||(y1+test_box1['height']<= y2)){
			return false;
			//y1+test_box1['height']
		}
		return true;
	};

	this.score_goal = function(){
	
		if(this.hit(player,0,g.thing,0)){
			score_sound.play();
			console.log('goal');
			g.thing.destroy();
			this.player_has_ball = true;
			
			//this.inLoop = false;

		};
	};

	this.is_hit = function(){
		for (var z in this.opfor_team){
			if(player.b_active == 1 && player.b_action != 'death'){
				if(this.hit(player,1,this.opfor_team[z],0)){
					
					player.b_action = 'death';
					this.opfor_team[z].action='death';
					op_death.play();
				};
			};
			if(this.opfor_team[z].b_active == 1 && this.opfor_team[z].action != 'dead' && this.opfor_team[z].action !='death'){
				if(this.hit(player,0,this.opfor_team[z],1)){
					player.health -= 1;
					if(!this.is_player_alive()){
						//alert("You died!");
						console.log("You died!");
						player_death.play();
						this.is_inLoop = false;
						this.is_playing();
						m.drawmap('defeat');
					};
					
				};
			};
			if(this.opfor_team[z].action != 'dead' && this.opfor_team[z].action !='death'){
				if(this.hit(player,0,this.opfor_team[z],0)){
					player.health -= 10;
					if(!this.is_player_alive()){
						
						console.log("You died!");
						player_death.play();
						this.is_inLoop = false;
						this.is_playing();
						m.drawmap('defeat');
						//alert("You died!");
					};
				};
			};
			
		};
	};
	this.is_player_alive = function(){
		if(player.health > 0){
			return true;
		}else{
			return false;
		};
	};
	this.is_falling = function(item){
		//console.log(item.y_pos+item.hitbox['height'], item.x_pos);
		var on_floor = false;
		$('.floor').each(function(){
			var floor = $(this);
			
			
			//console.log(floor.offset().top, floor.offset().left, floor.outerWidth());
			if(((floor.offset().top >= (item.y_pos+item.hitbox['height']) && floor.offset().top-20 <= item.y_pos + item.hitbox['height'] -10 )&&((floor.offset().left + floor.outerWidth()) >= item.x_pos+item.hitbox['width'] && floor.offset().left <= item.x_pos+item.hitbox['width']))||(item.action == 'jumping')){
				
				item.falling = false;
				on_floor = true;
			}else{
				if(!on_floor){
				item.falling = true;
				};
			};
		});
	};
};

function O_map(){
	this.floorcount = 0;
	var floors = new Array();
	this.mapinfo = {
		'menu': {'file': 'menu_screen.png'},
		'victory': {'file': 'shooter_victory_screen.png'},
		'defeat': {'file': 'shooter_defeat_screen.png'},
		'map1': {'file': 'map_1.png',
				'dimentions': [1000,1000],
				'player_start': [400,200],
				'opfor_start':	[100,50],//[100,0],		
				'floors': [{'y': 5, 'x': [1,5]},
						{'y': 4, 'x': [.5,1.5]},
						{'y': 4, 'x': [7,2]},
						{'y': 3, 'x': [3,1]},
						{'y': 2, 'x': [4,2]},
						{'y': 1, 'x': [1,2]},
						{'y': 6.8, 'x': [0,10]}]
			},

		'map2': {'file': 'map2.png',
				'player_start': [600,500],
				'opfor_start': [500,0],
				'net': [400,0],
				'floors': [{'y': 6, 'x': [2,6]},
							{'y': 5, 'x': [4,2]},
							{'y': 4, 'x': [1,2]},
							{'y': 4, 'x': [7,2]},
							{'y': 3, 'x': [3,4]},
							{'y': 2, 'x': [1,3]},
							{'y': 2, 'x': [6,3]},
							{'y': 1, 'x': [4,2]}]}
		};
	this.drawmap = function(map_name){
		var gb = document.getElementById("map");
		var board = gb.getContext("2d");
		gb.height = 700;
		gb.width = 1000;
		var map_file = '';
		if(map_name == 'map1'){
			map_file = this.mapinfo.map1.file;
		}else if(map_name =='menu'){
			map_file = this.mapinfo.menu.file;
		}else if(map_name =='map2'){
			map_file = this.mapinfo.map2.file;
		}else if(map_name == 'victory'){
			map_file = this.mapinfo.victory.file;
		}else if(map_name == 'defeat'){
			map_file = this.mapinfo.defeat.file;
		};
		console.log(map_file);
		//board.fillStyle = "#bbbbbb";
		//board.fillRect(0,0,1000,500);
		if(map_file != 'map2'){
			$("#map").css('background', 'URL(' + map_file + ') 0px 0px').css('top', '-300px').css('z-index','10');
		}else{
			$("#map").css('background', 'URL(' + map_file + ') 0px 0px').css('top', '-300px').css('z-index','1');
		};
	};

	this.lay_floor = function(yf,xf0,xf1){
		this.id = 'floor' + this.floorcount++;
		this.box = document.createElement("DIV");
		this.box.id = this.id;
		document.body.appendChild(this.box);
		$("#"+this.id).css('display','inline-block').css('position','absolute').css('left', (xf0 * 100)+10 +'px').css('top', (yf * 100)+10 + "px").css('width', xf1*100 + 'px').css('height', '10px').addClass('floor');
		floors.push(this.id);
	};
	this.build_floors = function(){
		//console.log();
		for(f in this.mapinfo.map2.floors){
			//console.log(this.mapinfo.map1.floors[f]);
			this.lay_floor(this.mapinfo.map2.floors[f].y, this.mapinfo.map2.floors[f].x[0], this.mapinfo.map2.floors[f].x[1]);
		}
	};

	this.remove_floors = function(){
		for(f in floors){
			$("#"+floors[f]).remove();
		}
		
	};

};




