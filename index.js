const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024 //pixels
canvas.height = 576

//create black rectangle to fill height and width of canvas
//makes more visible while designing game
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	}, 
	imageSrc: './img/background.png'
})

const shop = new Sprite({
	position: {
		x: 600,
		y: 128
	}, 
	imageSrc: './img/shop.png',
	scale: 2.75,
	framesMax: 6
})

const player = new Fighter ({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './img/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: './img/samuraiMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/samuraiMack/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/samuraiMack/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/samuraiMack/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/samuraiMack/Attack1.png',
			framesMax: 6
		},
		takeHit: {
			imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
			framesMax: 4
		},
		death: {
			imageSrc: './img/samuraiMack/Death.png',
			framesMax: 6
		}
	},
	attackBox: {
		offset: {
			x: 100,
			y: 50
		},
		width: 160,
		height: 50
	}
})

const enemy = new Fighter ({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	}, 
	color: 'blue',
	offset: {
		x: -50,
		y: 0
	},
	imageSrc: './img/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 167
	},
	sprites: {
		idle: {
			imageSrc: './img/kenji/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './img/kenji/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/kenji/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/kenji/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/kenji/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/kenji/Take hit.png',
			framesMax: 3
		},
	death: {
			imageSrc: './img/kenji/Death.png',
			framesMax: 7
		}
	},
	attackBox: {
		offset: {
			x: -170,
			y: 50
		},
		width: 170,
		height: 50
	}
})

enemy.draw();

console.log(player);

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	}, 
	w: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}
}

decreaseTimer();

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'; //to prevent a complete red canvas
	c.fillRect(0, 0, canvas.width, canvas.height); //make sure not drawing anything when calling method -- prevent paint streak effect
	background.update();
	shop.update();
	c.fillStyle = 'rgba(255, 255, 255, 0.15)' //white overlay with opacity of 0.1 --> contrast players from background
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0; //make sure player stops moving when lift up on key
	enemy.velocity.x = 0;

	//player movement
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5;
	player.switchSprite('run');
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5; 
		player.switchSprite('run');
	} else {
		player.switchSprite('idle');
	}

	//jumping
	if (player.velocity.y < 0) {
		player.switchSprite('jump'); //when sprite is jumping
	} else if (player.velocity.y > 0) { //when sprite is falling
		player.switchSprite('fall');
	}

		//enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5;
		enemy.switchSprite('run');
	} else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5;
		enemy.switchSprite('run');
	} else {
		enemy.switchSprite('idle');
	}
		//jumping
		if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump'); //when sprite is jumping
	} else if (enemy.velocity.y > 0) { //when sprite is falling
		enemy.switchSprite('fall');
	}

	//detect for collision & enemy gets hit
	if (
		rectangularCollision({
			rectangle1: player,
			rectangle2: enemy
		}) &&
		player.isAttacking && player.framesCurrent === 4) //health subtracted at frame for sword attack
		{
		enemy.takeHit();
		player.isAttacking = false; //so player only attacks once 
		// document.querySelector('#enemyHealth').style.width = enemy.health + '%'; //selected enemyHealth id from .html file and decrease health bar when hit
		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		})
		}

	//if player misses
	if (player.isAttacking && player.framesCurrent === 4) {
		player.isAttacking = false;
	}

	//if player gets hit
	if (
		rectangularCollision({
			rectangle1: enemy,
			rectangle2: player
		}) &&
		enemy.isAttacking && enemy.framesCurrent === 2) 
		{
		player.takeHit();
		enemy.isAttacking = false; //so player only attacks once 
		gsap.to('#playerHealth', {
			width: player.health + '%'
		})
		}

	//if enemy misses
	if (enemy.isAttacking && enemy.framesCurrent === 2) {
		enemy.isAttacking = false;
	}

		//end game based on health
	if (enemy.health <= 0 || player.health <= 0) {
		determineWinner({ player, enemy, timerId });
	}
}

animate()

window.addEventListener('keydown', (event) => {
	if (!player.dead) {
	switch (event.key) {
		case 'd':
			keys.d.pressed = true; //when hold down the key, the play moves in the x axis to the right
			player.lastKey = 'd';
			break;
		case 'a':
			keys.a.pressed = true; //when hold down the key, the play moves in the x axis to the left
			player.lastKey = 'a';
			break;
		case 'w':
			player.velocity.y = -20;
			break; 
		case ' ':
			player.attack(); //only attack when player hits spacebar
			break;
		}
	}
	if (!enemy.dead) {
	switch (event.key){
		case 'ArrowRight':
			keys.ArrowRight.pressed = true; //when hold down the key, the play moves in the x axis to the right
			enemy.lastKey = 'ArrowRight';
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true; //when hold down the key, the play moves in the x axis to the left
			enemy.lastKey = 'ArrowLeft';
			break;
		case 'ArrowUp':
			enemy.velocity.y = -20;
			break; 
		case 'ArrowDown':
			enemy.attack();
			break; 
		}
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'a':
			keys.a.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'w':
			keys.w.pressed = false; //when you stop holding down key, player stops moving
			break;
	}	
	//enemy keys
	switch (event.key) {
		case 'ArrowRight':
			keys.ArrowRight.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false; //when you stop holding down key, player stops moving
			break;
		case 'w':
			keys.w.pressed = false; //when you stop holding down key, player stops moving
			break;
	}	
})