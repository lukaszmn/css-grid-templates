//const Parser = require('parser');
import { Parser } from './parser.js';


const maxCount = 15;

const styles = [
	'1fr auto',
	'1fr 1fr 2fr 1fr 10%',
	'1fr 1fr minmax(200px, 1fr)',
	'min-content max-content fit-content(300px) minmax(100px, 200px)',
	'repeat(6, 6em)',
	'repeat(6, 1fr)',
	'repeat(6, minmax(6em, 1fr))',
	'repeat(6, fit-content(9rem))',
	'1fr repeat(3, 6em) 1fr',
	'repeat(auto-fit, minmax(6em, 1fr))',
	'repeat(auto-fill, minmax(6em, 1fr))'
];


// create styles

let styleIndex = 0;
for (let style of styles) {

	const title = document.createElement('p');
	title.innerText = style;

	const section = document.createElement('section');
	section.classList.add('grid');
	section.style.gridTemplateColumns = style;

	Parser.parse(style);
	const names = Parser.getValues();

	let html = '';
	for (let i = 1; i <= maxCount; ++i) {
		const name = names[(i - 1) % names.length];
		html += `<div class="item-${i}">${i}<span class="description">${name}</span></div>`;
	}
	section.innerHTML = html;

	document.body.appendChild(document.createElement('hr'));
	document.body.appendChild(title);
	document.body.appendChild(section);
	++styleIndex;
}


// show / hide items

const items = [];
for (let i = 1; i <= maxCount; ++i) {
	items.push(document.getElementsByClassName('item-' + i));
}

function showItems(n) {
	countLabel.innerHTML = n;

	for (let i = 1; i <= maxCount; ++i) {
		const style = i <= n ? 'block' : 'none';
		for (let item of items[i - 1]) {
			item.style.display = style;
		}
	}
}


// set up count slider

const countDiv = document.getElementById('count-slider');
const countSlider = countDiv.getElementsByTagName('input')[0];
const countLabel = countDiv.getElementsByTagName('span')[0];
countSlider.max = maxCount;
showItems(countSlider.value);

countSlider.oninput = function () {
	showItems(this.value);
}


// set up width slider

const widthStep = 30;

const widthDiv = document.getElementById('width-slider');
const widthSlider = widthDiv.getElementsByTagName('input')[0];
const widthLabel = widthDiv.getElementsByTagName('span')[0];
widthSlider.max = widthSlider.value = window.innerWidth / widthStep;
setWidth(widthSlider.value);

widthSlider.oninput = function () {
	setWidth(this.value);
}


function setWidth(width) {
	const newWidth = width * widthStep;
	widthLabel.innerText = newWidth;
	const grids = document.getElementsByClassName('grid');
	for (let grid of grids) {
		grid.style.maxWidth = '' + newWidth + 'px';
	}
}


// add names


function addNamesChanged() {
	if (addNamesCheckbox.checked) {
		document.body.classList.add('show-names');
	} else {
		document.body.classList.remove('show-names');
	}
}

const addNamesCheckbox = document.getElementById('add-names');
addNamesCheckbox.addEventListener('change', addNamesChanged);
addNamesChanged();
