import { getApiKey } from "./readfile.js";
import { createAlphabetDisplay } from "./letters.js";

let currentScore = 0;
let maxScore = 0;
let currentRow = 0;
let wordToGuess = "";

// Helper function to generate a random word
const generateRandomWord = async () => {
	const apiKey = await getApiKey();
	const api = `https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&minLength=5&maxLength=5&limit=1&api_key=${apiKey}`;
	const response = await fetch(api);
	const words = await response.json();
	wordToGuess = (words[0].word).toLowerCase();

	if (wordToGuess.length == 0 || wordToGuess.length > 5) {
		const backupWords = [
			"found",
			"truth",
			"books",
			"rover",
			"plane",
			"roses",
			"earth",
			"couch",
			"apple"
		];
	
		wordToGuess = backupWords[Math.floor(Math.random() * words.length)];
	}

	console.log(wordToGuess);
    
	return await wordToGuess;
};

// Helper function to show error messages
const showError = message => {
	const errorBox = document.createElement("div");
	errorBox.className = "fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center";
	errorBox.innerText = message;
	document.body.appendChild(errorBox);

	const closeError = event => {
		if (!errorBox.contains(event.target)) {
			errorBox.remove();
			document.removeEventListener("click", closeError);
		}
	};
	document.addEventListener("click", closeError);
};

// Helper function to show error messages
const showWinMessage = message => {
	const messageBox = document.createElement("div");
	messageBox.className = `fixed min-w-48 min-h-20 max-w-48 max-h-20 inset-[43%] 
                            bg-emerald-500 bg-opacity-80 border-double border-4 
                            border-green-500/[.8] rounded bold text-white flex 
                            items-center text-center justify-center`;
	messageBox.innerText = message;
	document.body.appendChild(messageBox);

	const closeBox = event => {
		if (!messageBox.contains(event.target)) {
			messageBox.remove();
			document.removeEventListener("click", closeBox);
		}
	};
	document.addEventListener("click", closeBox);
};

// Helper function to display user scores
const displayUserScore = () => {
	document.getElementById("currentScore").innerText = currentScore;
	document.getElementById("maxScore").innerText = maxScore;
};

// Helper function to create a board row
const createBoardRow = rowIndex => {
	const row = document.createElement("div");
	row.classList.add("row");
	if (rowIndex !== currentRow) row.classList.add("disabled");

	for (let i = 0; i < 5; i++) {
		const input = document.createElement("input");
		input.type = "text";
		input.maxLength = "1";
		input.disabled = rowIndex !== currentRow;
		input.className = `size-20 border-2 border-solid border-black rounded-full 
                            bg-aliceblue p-1 mx-1 my-4 text-center text-4xl`;
		input.addEventListener("keydown", handleInput);
		row.appendChild(input);
	}
	return row;
};

// Helper function to handle input event
const handleInput = event => {
    const input = event.target;
    if (input.value.length === 1 || event.key === "ArrowRight") {
        moveToNextInput(input);
    } else if (event.key === "Backspace" && input.value === "") {
        moveToPreviousInput(input);
    } 
};

// Helper function
const moveToPreviousInput = currentInput => {
    const inputs = Array.from(currentInput.parentElement.querySelectorAll("input"));
    let currentIndex = inputs.indexOf(currentInput);
    if (currentIndex > 0) {
        inputs[currentIndex - 1].focus();
    } else {
        currentIndex = 5;
        inputs[currentIndex - 1].focus();
    }
};

// Helper function to move to the next input
const moveToNextInput = currentInput => {
	const inputs = Array.from(currentInput.parentElement.querySelectorAll("input"));
	const currentIndex = inputs.indexOf(currentInput);
	for (let i = currentIndex + 1; i < inputs.length; i++) {
		if (!inputs[i].value) {
			inputs[i].focus();
			return;
		}
	}
    // Check from the beginning of the row again
    for (let i = 0; i <= currentIndex; i++) {
        if (!inputs[i].value) {
            inputs[i].focus();
            return;
        }
    }
    // Focus on the last input if all are filled
    inputs[inputs.length - 1].focus();
};

// Helper function to display the Wordle board
const displayWordleBoard = (boardDiv, boardArray) => {
	for (let i = 0; i < 6; i++) {
		const row = createBoardRow(i);
		boardArray.push(row);
		boardDiv.append(row);
	}
};

// Helper function to disable a row
const disableRow = rowElement => {
	rowElement.classList.add("disabled");
	const inputs = rowElement.querySelectorAll("input");
	inputs.forEach(input => (input.disabled = true));
};

// Helper function to enable a row
const enableRow = rowElement => {
	rowElement.classList.remove("disabled");
	const inputs = rowElement.querySelectorAll("input");
	inputs.forEach(input => (input.disabled = false));
};

// Helper function to reset the board
const resetBoard = async (boardDiv, boardArray) => {
	boardDiv.innerHTML = "";
	boardArray.length = 0;
	currentRow = 0;

	displayWordleBoard(boardDiv, boardArray);
	displayUserScore();
	// Reads letters js as well so event listeners are set
	createAlphabetDisplay();

	// Enable the first row after reset
	const nextRowElement = document.querySelector(`.row:nth-child(${currentRow + 1})`);
	enableRow(nextRowElement);

	// Focus on first box
    Array.from((document.querySelector(`.row:nth-child(${currentRow + 1})`)).querySelectorAll("input"))[0].focus();

	await generateRandomWord();
};

// Validate form submission
const validateFormSubmission = (event, boardDiv, boardArray) => {
	event.preventDefault();

	const currentRowElement = document.querySelector(`.row:nth-child(${currentRow + 1})`);
	const inputs = currentRowElement.querySelectorAll("input");
	const guessedWord = Array.from(inputs).map(input => input.value).join("");

	if (guessedWord.length !== 5) {
		showError("Please enter a 5-letter word.");
		return;
	}

	if (!/^[a-zA-Z]+$/.test(guessedWord)) {
		showError("Your word is not all letters.");
		return;
	}

	inputs.forEach((input, index) => {
		const letter = input.value.toLowerCase();
		const letterBox = document.querySelector(`.letterBox${letter.toUpperCase()}`);
		if (wordToGuess[index] === letter) {
			input.className += ` bg-green-500/[.6] shadow shadow-green-500/50`;
			if (!(letterBox.className).includes("emerald")) {
				letterBox.className += ` bg-emerald-400/[.9] shadow-sm shadow-emerald-400/50`;
			}
		} else if (wordToGuess.includes(letter)) {
			input.className += ` bg-amber-400/[.6] shadow shadow-amber-400/50`;
			if (!(letterBox.className).includes("yellow") && !(letterBox.className).includes("emerald")) {
				letterBox.className += ` bg-yellow-400/[.9] shadow-sm shadow-yellow-400/50`;
			}
		} else { 
			input.className += ` bg-stone-500/[.6] shadow shadow-stone-500/50`;
			if (!(letterBox.className).includes("zinc")) {
				letterBox.className += ` bg-zinc-400/[.9] shadow-sm shadow-zinc-500/50`;
			}
		}
	});

	disableRow(currentRowElement);

	// Word was guessed resetting board
	if (guessedWord === wordToGuess) {
		currentScore++;
		if (maxScore < currentScore) {
			maxScore = currentScore;
		}
		showWinMessage(`You got the correct word! ${wordToGuess}`);
		resetBoard(boardDiv, boardArray);
		return;
	}

	// User failed 5 times reset board
	if (currentRow === 5) {
		currentScore = 0;
		showError(`You lose, the word was ${wordToGuess}`);
		resetBoard(boardDiv, boardArray);
		return;
	}

	// Moving to next row
	currentRow++;
	const nextRowElement = document.querySelector(`.row:nth-child(${currentRow + 1})`);
	if (nextRowElement) {
		enableRow(nextRowElement);
	}

    // Focusing on first box in new row after submitting, selects the current div row element then the inputs in it then focuses on the first one
    Array.from((document.querySelector(`.row:nth-child(${currentRow + 1})`)).querySelectorAll("input"))[0].focus();
};

// Main Wordle function
const mainWordle = async () => {
	const boardDiv = document.getElementById("wordleBoard");
	const boardArray = [];

	resetBoard(boardDiv, boardArray);

	document.getElementById("wordleForm")
        .addEventListener("submit", event =>
			validateFormSubmission(event, boardDiv, boardArray)
		);
};

mainWordle();

export { currentRow };
