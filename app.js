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
const messageEl = document.querySelector('#message');
const easyBtnEl = document.querySelector('#easy');
const mediumBtnEl = document.querySelector('#medium');
const hardBtnEl = document.querySelector('#hard');
let squareEls;
/*----------------------------- Event Listeners -----------------------------*/
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
		const index = Math.floor(Math.random() * width * width - 1);
		gameBoard.at(index).value = 'bomb';
		bombs = bombTotal();
	}
}

function bombTotal() {
	let bombs = gameBoard.filter((el) => {
		return el.value === 'bomb';
	});
	return bombs.length;
}

// borrowed and modified from this YouTube video by Ania Kubow:
// https://www.youtube.com/watch?v=jS7iB9mRvcc
// checks for bombs in surrounding squares, checks if a square is on an edge of the board,
// and updates the value property for the corresponding index in the gameBoard array
// with # of bombs counted. modified to account for different board widths
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
	if (e.target.className === 'sqr') {
		const squareIndex = Number(e.target.id);
		revealSquare(squareIndex);
		checkForBomb(squareIndex);
		if (gameBoard[squareIndex].value === '') {
			flood(squareIndex);
		}
		checkForWin();
		render();
	}
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
	if (gameBoard[index].revealed !== true) {
		gameBoard[index].revealed = true;
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

// copied and modified from the surroundingBombCounter()
function flood(index) {
	const isLeftEdge = index % width === 0;
	const isRightEdge = index % width === width - 1;
	if (gameBoard[index].value !== '') {
		return 1;
	}

	if (
		index >= width &&
		gameBoard.at(index - width).value !== 'bomb' &&
		gameBoard.at(index - width).revealed === false
	) {
		revealSquare(index - width);
		flood(index - width);
	}
	if (
		index > 0 &&
		!isLeftEdge &&
		gameBoard.at(index - 1).value !== 'bomb' &&
		gameBoard.at(index - 1).revealed === false
	) {
		revealSquare(index - 1);
		flood(index - 1);
	}
	if (
		index > 0 &&
		!isRightEdge &&
		gameBoard.at(index + 1).value !== 'bomb' &&
		gameBoard.at(index + 1).revealed === false
	) {
		revealSquare(index + 1);
		flood(index + 1);
	}
	if (
		index < gameBoard.length - width &&
		gameBoard.at(index + width).value !== 'bomb' &&
		gameBoard.at(index + width).revealed === false
	) {
		revealSquare(index + width);
		flood(index + width);
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
			width = 16;
			bombsPlaced = 40;
			boardEl.style.gridTemplateColumns = `repeat(${width}, 20px)`;
			boardEl.style.gridTemplateRows = `repeat(${width}, 20px)`;
			break;
		case 'hard':
			width = 22;
			bombsPlaced = 80;
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
