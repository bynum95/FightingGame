function hitBox({ playerOneHitBox, playerTwoHitBox }) {
	return (
		playerOneHitBox.attackBox.position.x + playerOneHitBox.attackBox.width >= 
			playerTwoHitBox.position.x && 
		playerOneHitBox.attackBox.position.x <= 
			playerTwoHitBox.position.x + playerTwoHitBox.width &&
		playerOneHitBox.attackBox.position.y + playerOneHitBox.attackBox.height >= 
			playerTwoHitBox.position.y && 
		playerOneHitBox.attackBox.position.y <= playerTwoHitBox.position.y + playerTwoHitBox.height 
		)
}

function determineWinner({ player, enemy, timerId }) {
	clearTimeout(timerId)
	document.querySelector('#displayText').style.display = 'flex';
	if (player.health === enemy.health) {
			document.querySelector('#displayText').innerHTML = 'TIE';
		} else if (player.health > enemy.health) {
			document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
		} else if (player.health < enemy.health) {
			document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
		}
}

let timer = 60;
let timerId
function decreaseTimer() {
	
	if (timer > 0){
		timerId = setTimeout(decreaseTimer, 1000);
		timer --;
		document.querySelector('#timer').innerHTML = timer; //grabs the inner HTML text for the timer id
	}
	if (timer ===0) {
		determineWinner({ player, enemy, timerId })
	}
}