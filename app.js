const containerEl = document.querySelector('.gameboard');

function init() {
	for (let i = 0; i < 81; i++) {
		const sqrEl = document.createElement('div');
		sqrEl.className = 'sqr';
		sqrEl.textContent = 'o';
		containerEl.appendChild(sqrEl);
	}
}

init();
