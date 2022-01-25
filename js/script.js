let questions = [];
let counter = 0;
let point = 0;

const URLAPI = {
	noCategory: "https://opentdb.com/api.php?amount=10&type=multiple",
	generalKnowledge: "https://opentdb.com/api.php?amount=10&category=9&type=multiple",
	film: "https://opentdb.com/api.php?amount=10&category=11&type=multiple",
	music: "https://opentdb.com/api.php?amount=10&category=12&type=multiple",
	videoGames: "https://opentdb.com/api.php?amount=10&category=15&type=multiple",
	computers: "https://opentdb.com/api.php?amount=10&category=18&type=multiple",
};

const submitName = document.getElementById("submit-name");
if (submitName != null) {
	submitName.addEventListener("click", showPlayerName);
}

const loadBtn = document.getElementById("load-btn");
if (loadBtn != null) {
	loadBtn.addEventListener("click", () => {
		loadDashboard();
		loadBtn.innerText = "Reload Dashboard";
	});
}

const startBtn = document.getElementById("start-btn");
if (startBtn != null) {
	startBtn.addEventListener("click", async () => {
		lastPlayerPoint();
		restartGame();
		await loadQuestions();
		showQuestion();
	});
}

const option1 = document.getElementById("option1");
if (option1 != null) {
	option1.addEventListener("click", () => {
		let answer = option1.innerText;

		checkAnswer(answer, questions[counter - 1].correctAnswer);

		// Show next question
		if (counter !== 0) {
			showQuestion();
		} else {
			changeDisplay(["question-card"], "none");
			changeDisplay(["start-btn"], "inline-block");
			startBtn.innerText = "Star again";
		}
	});
}

const option2 = document.getElementById("option2");
if (option2 != null) {
	option2.addEventListener("click", () => {
		let answer = option2.innerText;

		checkAnswer(answer, questions[counter - 1].correctAnswer);

		// Show next question
		if (counter !== 0) {
			showQuestion();
		} else {
			changeDisplay(["question-card"], "none");
			changeDisplay(["start-btn"], "inline-block");
			startBtn.innerText = "Star again";
		}
	});
}

const option3 = document.getElementById("option3");
if (option3 != null) {
	option3.addEventListener("click", () => {
		let answer = option3.innerText;

		checkAnswer(answer, questions[counter - 1].correctAnswer);

		// Show next question
		if (counter !== 0) {
			showQuestion();
		} else {
			changeDisplay(["question-card"], "none");
			changeDisplay(["start-btn"], "inline-block");
			startBtn.innerText = "Star again";
		}
	});
}

const option4 = document.getElementById("option4");
if (option4 != null) {
	option4.addEventListener("click", () => {
		let answer = option4.innerText;

		checkAnswer(answer, questions[counter - 1].correctAnswer);

		// Show next question
		if (counter !== 0) {
			showQuestion();
		} else {
			changeDisplay(["question-card"], "none");
			changeDisplay(["start-btn"], "inline-block");
			startBtn.innerText = "Star again";
		}
	});
}

function showPlayerName() {
	const playerNameInput = document.getElementById("player-name-input");
	let player = document.getElementById("player");

	if ([null, undefined, ""].includes(playerNameInput.value)) {
		alert("Plase insert a name to continue.");
	} else {
		player.innerHTML = `Player: ${playerNameInput.value}`;

		changeDisplay(["form-player"], "none");
		changeDisplay(["status", "start-btn-container"], "block");
	}
}

function Question(category, difficulty, question, correctAnswer, answers) {
	this.category = category;
	this.difficulty = difficulty;
	this.question = question;
	this.correctAnswer = correctAnswer;
	this.answers = answers;
}

async function getQuestions(url) {
	// get question from API
	await fetch(url)
		.then((response) => response.json())
		.then((json) => {
			questions = [];

			json.results.forEach((question) => {
				questions.push(
					new Question(question.category, question.difficulty, question.question, question.correct_answer, [
						question.incorrect_answers[0],
						question.incorrect_answers[1],
						question.incorrect_answers[2],
						question.correct_answer,
					])
				);
			});
		});

	// sort randomly
	for (let i = 0; i < questions.length; i++) {
		questions[i].answers = shuffler(questions[i].answers);
	}
}

async function loadQuestions() {
	changeDisplay(["start-btn"], "none");
	changeDisplay(["loading-spinner"], "block");

	await getQuestions(URLAPI.noCategory);

	changeDisplay(["welcome", "loading-spinner"], "none");
	changeDisplay(["question-card"], "block");
}

function showQuestion() {
	const questionCounter = document.getElementById("question-counter");
	const questionText = document.getElementById("question");
	const options = [
		document.getElementById("option1"),
		document.getElementById("option2"),
		document.getElementById("option3"),
		document.getElementById("option4"),
	];

	// print question
	questionText.innerText = questions[counter].question;

	// print options
	for (let i = 0; i < questions[counter].answers.length; i++) {
		const answer = questions[counter].answers[i];
		options[i].innerHTML = answer;
	}

	// Update player status
	questionText.innerHTML = questions[counter].question;
	questionCounter.innerHTML = `Question ${++counter} of ${questions.length}`;
}

function checkAnswer(answer, correctAnswer) {
	let answerIsCorrect = false;
	const points = document.getElementById("points");

	if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
		answerIsCorrect = true;
	}

	if (answerIsCorrect) {
		alert("Your answer is correct!");
		points.innerHTML = `Points: ${++point}`;
	} else {
		alert("Your answer is incorrect.");
	}

	// Reset counter when reach last question
	counter = counter === questions.length ? 0 : counter;
}

function shuffler(answers) {
	let shuffled = answers
		.map((answer) => ({ answer, id: Math.random() * 4 }))
		.sort((a, b) => a.id - b.id)
		.map(({ answer }) => answer);

	return shuffled;
}

function changeDisplay(elIds, value) {
	for (const elId of elIds) {
		const el = document.getElementById(elId);
		el.style.display = value;
	}
}

async function loadDashboard() {
	const tBody = document.getElementById("tbody");
	tBody.innerHTML = "";

	await fetch("../assets/database.json")
		.then((response) => response.json())
		.then((json) => {
			let dbData = json;
			let i = 1;
			dbData.sort((a, b) => b.points - a.points);

			dbData.forEach((el) => {
				let tr = document.createElement("tr");

				tr.innerHTML = `
				<tr>
					<th scope="row">${i}</th>
					<td>${el.player}</td>
					<td>${el.points}</td>
				</tr>
				`;

				tBody.appendChild(tr);

				i++;
			});
		});
}

function lastPlayerPoint() {
	sessionStorage.clear();

	sessionStorage.setItem("playerName", document.getElementById("player-name-input").value);
	let playerName = sessionStorage.getItem("playerName");

	sessionStorage.setItem("playerPoints", point);
	let playerPoints = sessionStorage.getItem("playerPoints");

	if (point !== 0) {
		const playerLastPoints = document.getElementById("player-last-points");
		playerLastPoints.innerHTML = `Last play: ${playerName} | Points: ${playerPoints}`;
	}
}

function restartGame() {
	questions = [];
	counter = 0;
	point = 0;

	const points = document.getElementById("points");
	points.innerHTML = `Points: 0`;

	const timer = document.getElementById("timer");
	timer.innerHTML = `timer: 00:00`;
}
