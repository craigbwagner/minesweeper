/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/
let time;
let won;
let lost;
let gameBoard;
let width = 9;

/*------------------------ Cached Element References ------------------------*/
const boardEl = document.querySelector('.gameboard');
const buttonEl = document.querySelector('#reset');
const messageEl = document.querySelector('#message');

for (let i = 0; i < 81; i++) {
	const sqrEl = document.createElement('div');
	sqrEl.className = 'sqr';
	sqrEl.id = i;
	boardEl.appendChild(sqrEl);
}

const squareEls = document.querySelectorAll('.sqr');
/*----------------------------- Event Listeners -----------------------------*/
buttonEl.addEventListener('click', init);

/*-------------------------------- Functions --------------------------------*/
function init() {
	time = 0;
	won = false;
	lost = false;
	gameBoard = new Array(81);
	for (let i = 0; i < 81; i++) {
		gameBoard[i] = { revealed: false, value: '' };
		squareEls[i].style.backgroundColor = 'rgb(95, 95, 95)';
		squareEls[i].textContent = '';
	}

	placeBombs();
	bombCounter();

	render();

	console.log(gameBoard);

	boardEl.addEventListener('click', handleClick);
}

//rendering functions
function render() {
	updateBoard();
	updateMessage();
}

function updateBoard() {
	gameBoard.forEach((square, index) => {
		if (square.revealed === true) {
			squareEls[index].textContent = square.value;
			squareEls[index].style.backgroundColor = 'rgb(150, 150, 150)';
		}
	});
}

function updateMessage() {}

//functions relevant to bomb placement and count
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

//functions for updating square values based on bordering bomb counts
function bombCounter() {
	gameBoard.forEach((square, index) => {
		if (square.value !== 'bomb') {
			let bombCounter = 0;
			const isLeftEdge = index % width === 0;
			const isRightEdge = index % width === width - 1;

			if (
				index > 8 &&
				!isLeftEdge &&
				gameBoard.at(index - 1 - width).value === 'bomb'
			) {
				bombCounter++;
			}
			if (index > 8 && gameBoard.at(index - width).value === 'bomb') {
				bombCounter++;
			}
			if (
				index > 8 &&
				!isRightEdge &&
				gameBoard.at(index - width + 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				index > 0 &&
				!isLeftEdge &&
				gameBoard.at(index - 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				index > 0 &&
				!isRightEdge &&
				gameBoard.at(index + 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				index < 72 &&
				!isLeftEdge &&
				gameBoard.at(index + width - 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (index < 72 && gameBoard.at(index + width).value === 'bomb') {
				bombCounter++;
			}
			if (
				index < 72 &&
				!isRightEdge &&
				gameBoard.at(index + width + 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (bombCounter > 0) {
				square.value = bombCounter;
			}
		}
	});
}

//functions for interactivity
function handleClick(e) {
	console.log(squareEls);
	if (gameBoard[e.target.id].revealed !== true) {
		gameBoard[e.target.id].revealed = true;
	}

	if (gameBoard[e.target.id].value === '') {
		flood(e);
	}

	checkForBomb(e);
	checkForWin();

	render();
}

function checkForBomb(e) {
	if (gameBoard[e.target.id].value === 'bomb') {
		lost = true;
		boardEl.removeEventListener('click', handleClick);
		messageEl.textContent = 'You lose!';
	}
}

function checkForWin() {}

//flooding function
// function flood(e) {
// 	console.log('flood');
// }

//initialization

init();
