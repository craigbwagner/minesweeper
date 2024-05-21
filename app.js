/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/
let time;
let won;
let lost;
let gameBoard;

/*------------------------ Cached Element References ------------------------*/
const containerEl = document.querySelector('.gameboard');
const buttonEl = document.querySelector('#reset');
const messageEl = document.querySelector('#message');

/*----------------------------- Event Listeners -----------------------------*/
containerEl.addEventListener('click', handleClick);
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
	console.log(gameBoard);
}

function handleClick(e) {}

function reset() {}


init();

for (let i = 0; i < 81; i++) {
	const sqrEl = document.createElement('div');
	sqrEl.className = 'sqr';
	containerEl.appendChild(sqrEl);
}
