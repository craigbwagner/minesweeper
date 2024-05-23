/*-------------------------------- Constants --------------------------------*/

/*-------------------------------- Variables --------------------------------*/
let time;
let won;
let lost;
let gameBoard;
let width = 9;
let bombsPlaced = 10;

/*------------------------ Cached Element References ------------------------*/
const bodyEl = document.querySelector('body');
const boardEl = document.querySelector('.gameboard');
const resetBtnEl = document.querySelector('#reset');
const messageEl = document.querySelector('#message');
const easyBtnEl = document.querySelector('#easy');
const mediumBtnEl = document.querySelector('#medium');
const hardBtnEl = document.querySelector('#hard');
let squareEls;
/*----------------------------- Event Listeners -----------------------------*/
resetBtnEl.addEventListener('click', reset);
easyBtnEl.addEventListener('click', changeDifficulty);
mediumBtnEl.addEventListener('click', changeDifficulty);
hardBtnEl.addEventListener('click', changeDifficulty);
boardEl.addEventListener('click', handleClick);
boardEl.addEventListener('contextmenu', handleRightClick);

/*-------------------------------- Functions --------------------------------*/
function init() {
	time = 0;
	won = false;
	lost = false;

	for (let i = 0; i < width * width; i++) {
		const sqrEl = document.createElement('div');
		sqrEl.className = 'sqr';
		sqrEl.id = i;
		boardEl.appendChild(sqrEl);
	}

	squareEls = document.querySelectorAll('.sqr');

	gameBoard = new Array(width * width);
	for (let i = 0; i < width * width; i++) {
		gameBoard[i] = { revealed: false, value: '' };
		squareEls[i].style.backgroundColor = 'rgb(95, 95, 95)';
		squareEls[i].textContent = '';
	}

	placeBombs();
	surroundingBombCounter();

	render();
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
			if (square.value === 'bomb') {
				squareEls[index].innerHTML =
					"<img src='./assets/bomb-png-46599.png'></img>";
			}
		}
	});
}

function updateMessage() {
	if (won === true) {
		messageEl.textContent = 'You win!';
	} else if (lost === true) {
		messageEl.textContent = 'You lose!';
	}
}

//functions relevant to bomb placement and count
function placeBombs() {
	let bombs = bombTotal();
	while (bombs < bombsPlaced) {
		let index = Math.floor(Math.random() * width * width - 1);
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
function surroundingBombCounter() {
	gameBoard.forEach((square, index) => {
		if (square.value !== 'bomb') {
			let bombCounter = 0;
			const numIndex = Number(index);
			const isLeftEdge = numIndex % width === 0;
			const isRightEdge = numIndex % width === width - 1;

			if (
				numIndex > width - 1 &&
				!isLeftEdge &&
				gameBoard.at(numIndex - 1 - width).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex > width - 1 &&
				gameBoard.at(numIndex - width).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex > width - 1 &&
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
				numIndex < width * width - width &&
				!isLeftEdge &&
				gameBoard.at(numIndex + width - 1).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex < width * width - width &&
				gameBoard.at(numIndex + width).value === 'bomb'
			) {
				bombCounter++;
			}
			if (
				numIndex < width * width - width &&
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
	if (gameBoard[e.target.id].value === '') {
		flood(e.target.id);
	}
	checkForWin();
	render();
}

function handleRightClick(e) {
	e.preventDefault();
	let squareIndex = Number(e.target.id);

	if (squareEls[squareIndex].textContent === '') {
		squareEls[squareIndex].textContent = 'X';
	} else {
		squareEls[squareIndex].textContent = '';
	}
}

function revealSquare(index) {
	const numIndex = Number(index);
	if (gameBoard[numIndex].revealed !== true) {
		gameBoard[numIndex].revealed = true;
		render();
	}
}

function checkForBomb(index) {
	if (gameBoard[index].value === 'bomb') {
		lost = true;
		bodyEl.style.backgroundColor = 'red';
		boardEl.removeEventListener('click', handleClick);
		boardEl.removeEventListener('click', handleRightClick);
	}
}

function checkForWin() {
	const revealedSquares = gameBoard.filter((square) => {
		return square.revealed === true && square.value !== 'bomb';
	});
	if (revealedSquares.length === width * width - bombTotal()) {
		won = true;
		boardEl.removeEventListener('click', handleClick);
		boardEl.removeEventListener('click', handleRightClick);
	}
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
		numIndex < gameBoard.length - width &&
		gameBoard.at(numIndex + width).value !== 'bomb' &&
		gameBoard.at(numIndex + width).revealed === false
	) {
		revealSquare(numIndex + width);
		flood(numIndex + width);
	}
}

function changeDifficulty(e) {
	switch (e.target.id) {
		case 'easy':
			width = 9;
			bombsPlaced = 10;
			boardEl.style.gridTemplateColumns = `repeat(${width}, 20px)`;
			boardEl.style.gridTemplateRows = `repeat(${width}, 20px)`;
			break;
		case 'medium':
			width = 12;
			bombsPlaced = 17;
			boardEl.style.gridTemplateColumns = `repeat(${width}, 20px)`;
			boardEl.style.gridTemplateRows = `repeat(${width}, 20px)`;
			break;
		case 'hard':
			width = 16;
			bombsPlaced = 28;
			boardEl.style.gridTemplateColumns = `repeat(${width}, 20px)`;
			boardEl.style.gridTemplateRows = `repeat(${width}, 20px)`;
			break;
	}

	reset();
}

function reset() {
	boardEl.addEventListener('click', handleClick);
	boardEl.addEventListener('contextmenu', handleRightClick);
	messageEl.textContent = '';
	bodyEl.style.backgroundColor = 'white';
	boardEl.replaceChildren();

	init();
}

//initialization

init();
