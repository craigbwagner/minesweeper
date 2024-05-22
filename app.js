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
	messageEl.textContent = '';
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
}

function updateBoard() {
	gameBoard.forEach((square, index) => {
		if (square.revealed === true) {
			squareEls[index].textContent = square.value;
			squareEls[index].style.backgroundColor = 'rgb(150, 150, 150)';
		}
	});
}

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
			const numIndex = Number(index);
			const isLeftEdge = numIndex % width === 0;
			const isRightEdge = numIndex % width === width - 1;

			if (
				numIndex > 8 &&
				!isLeftEdge &&
				gameBoard.at(numIndex - 1 - width).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex > 8 &&
				gameBoard.at(numIndex - width).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex > 8 &&
				!isRightEdge &&
				gameBoard.at(numIndex - width + 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex > 0 &&
				!isLeftEdge &&
				gameBoard.at(numIndex - 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex > 0 &&
				!isRightEdge &&
				gameBoard.at(numIndex + 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex < 72 &&
				!isLeftEdge &&
				gameBoard.at(numIndex + width - 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex < 72 &&
				gameBoard.at(numIndex + width).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex < 72 &&
				!isRightEdge &&
				gameBoard.at(numIndex + width + 1).value === 'bomb'
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
	revealSquare(e.target.id);
	checkForBomb(e.target.id);
	checkForWin();
	if (gameBoard[e.target.id].value === '') {
		flood(e.target.id);
	}
}

function revealSquare(index) {
	if (gameBoard[index].revealed !== true) {
		gameBoard[index].revealed = true;
		render();
	}
}

function checkForBomb(index) {
	if (gameBoard[index].value === 'bomb') {
		lost = true;
		boardEl.removeEventListener('click', handleClick);
		messageEl.textContent = 'You lose!';
	}
}

function checkForWin() {
	gameBoard.reduce((acc, square) => {
		if (square.revealed && square.value !== 'bomb') {
			acc++;
			if (acc === 90) {
				won = true;
				boardEl.removeEventListener('click', handleClick);
			}
		}
	});
}

//flooding function
function flood(index) {
	const numIndex = Number(index);
	const isLeftEdge = numIndex % width === 0;
	const isRightEdge = numIndex % width === width - 1;
	if (gameBoard[numIndex].value !== '') {
		return 1;
	}

	if (
		numIndex >= width &&
		gameBoard.at(numIndex - width).value !== 'bomb' &&
		gameBoard.at(numIndex - width).revealed === false
	) {
		revealSquare(numIndex - width);
		flood(numIndex - width);
	}
	if (
		numIndex > 0 &&
		!isLeftEdge &&
		gameBoard.at(numIndex - 1).value !== 'bomb' &&
		gameBoard.at(numIndex - 1).revealed === false
	) {
		revealSquare(numIndex - 1);
		flood(numIndex - 1);
	}
	if (
		numIndex > 0 &&
		!isRightEdge &&
		gameBoard.at(numIndex + 1).value !== 'bomb' &&
		gameBoard.at(numIndex + 1).revealed === false
	) {
		revealSquare(numIndex + 1);
		flood(numIndex + 1);
	}
	if (
		numIndex < 72 &&
		gameBoard.at(numIndex + width).value !== 'bomb' &&
		gameBoard.at(numIndex + width).revealed === false
	) {
		revealSquare(numIndex + width);
		flood(numIndex + width);
	}
}

//initialization

init();
