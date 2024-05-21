const containerEl = document.querySelector('.container');

function init() {
	for (let i = 0; i < 81; i++) {
		const sqrEl = document.createElement('div');
		sqrEl.className = 'sqr';
		containerEl.appendChild(sqrEl);
	}
}

init();
