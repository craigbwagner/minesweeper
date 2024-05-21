/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/
let time;
let won;
let lost;
let gameBoard;

/*------------------------ Cached Element References ------------------------*/
const boardEl = document.querySelector('.gameboard');
const buttonEl = document.querySelector('#reset');
const messageEl = document.querySelector('#message');

/*----------------------------- Event Listeners -----------------------------*/
buttonEl.addEventListener('click', reset);

/*-------------------------------- Functions --------------------------------*/
function init() {
	time = 0;
	won = false;
	lost = false;
	gameBoard = new Array(81);
	for (let i = 0; i < 81; i++) {
		gameBoard[i] = { revealed: false, value: '' };
	}

	placeBombs();

	console.log(gameBoard);

	boardEl.addEventListener('click', handleClick);
}

function placeBombs() {
	let bombs = bombTotal();
	while (bombs < 10) {
		let index = Math.floor(Math.random() * 80);
		gameBoard[index].value = 'bomb';
		bombs = bombTotal();
	}
}

function bombTotal() {
	let bombs = gameBoard.filter((el) => {
		return el.value === 'bomb';
	});
	return bombs.length;
}
function handleClick(e) {}

function reset() {}

init();

for (let i = 0; i < 81; i++) {
	const sqrEl = document.createElement('div');
	sqrEl.className = 'sqr';
	boardEl.appendChild(sqrEl);
}
