import { currentRow } from "./wordle.js";

// Comment
const flipStyles = style => {
	const wrapper = document.getElementById("wrappingDiv");
	if (wrapper.className.includes(style)) {
		wrapper.classList.remove(style);
	} else {
		wrapper.className += " " + style;
	}
};

// Comment
const buttonFlipper = () => {
	flipStyles("flex-row-reverse");
	flipStyles("flex-wrap-reverse");
};

// Comment
const buttonHider = () => {
	const hideButton = document.getElementById("letterHideButton");
	const holder = document.getElementById("lettersHolder");
	const style = "hidden";
	if (holder.className.includes(style)) {
		holder.classList.remove(style);
		hideButton.innerHTML = "Hide";
	} else {
		holder.className += " " + style;
		hideButton.innerHTML = "Unhide";
	}
};

// Add code so when a letter is clicked its added to the user current input row adding the letter into the inputs left to right
const addLetterToRow = letter => {
	const row = document.querySelector(`.row:nth-child(${currentRow + 1})`);
	const inputs = Array.from(row.querySelectorAll("input"));
	for (let i = 0; i < inputs.length; i++) {
		if (!inputs[i].value) {
			inputs[i].value = letter.toLowerCase();
			// inputs[i++].focus();
			return;
		}
	}
};

// Comment
const displayLetter = letter => {
	const alphabetDiv = document.getElementById("lettersHolder");
	const letterDiv = document.createElement("div");
	letterDiv.innerHTML += letter;
	letterDiv.className = `letterBox${letter} p-2 mx-2 my-4 rounded-md bg-stone-200 text-center text-4xl hover:bg-white`;
	letterDiv.addEventListener("click", () => addLetterToRow(letter));
	alphabetDiv.append(letterDiv);
};

// Comment
const createAlphabetDisplay = () => {
	const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
	document.getElementById('lettersHolder').innerHTML = '';
	alphabet.forEach(letter => displayLetter(letter.toUpperCase()));
};

// Comment
const main = () => {
	document.getElementById("letterFlipButton")
		.addEventListener("click", buttonFlipper);

	document.getElementById("letterHideButton")
		.addEventListener("click", buttonHider);
};

main();

export { createAlphabetDisplay };
