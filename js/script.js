let playerName = "";
let playerPoints = 0;
let answer;
let answerIsCorrect = false;
let questions = [];

const URLAPI = {
	noCategory: "https://opentdb.com/api.php?amount=10&type=multiple",
	generalKnowledge: "https://opentdb.com/api.php?amount=10&category=9&type=multiple",
	film: "https://opentdb.com/api.php?amount=10&category=11&type=multiple",
	music: "https://opentdb.com/api.php?amount=10&category=12&type=multiple",
	videoGames: "https://opentdb.com/api.php?amount=10&category=15&type=multiple",
	computers: "https://opentdb.com/api.php?amount=10&category=18&type=multiple",
};

//requestsPlayerName();

function requestsPlayerName() {
	playerName = prompt("Insert your name");
	showPlayerName();
}

function showPlayerName() {
	// Mostrar el nombre del jugador en pantalla editando el texto de #player
	alert(`Welcome ${playerName} to Quiz game`);
}

function Question(category, difficulty, question, correctAnswer, answers) {
	this.category = category;
	this.difficulty = difficulty;
	this.question = question;
	this.correctAnswer = correctAnswer;
	this.answers = answers;
}

function getQuestions(url) {
	// get question from API
	fetch(url)
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
		console.log("Antes: ", questions[i].answers); // linea para verificar el orden ANTES de ordenarlo aleatoreamente.
		questions[i].answers = shuffler(questions[i].answers);
		console.log("Despues: ", questions[i].answers); // linea para verificar el orden DESPUES de ordenarlo aleatoreamente.
	}
}

function makeQuestion() {
	getQuestions(URLAPI.noCategory);

	questions.forEach((q) => {
		answer = prompt(`${q.question}\n\nType the correct one:\n\n${q.answers.join("\n")}`);

		answerIsCorrect = checkAnswer(answer, q.correctAnswer);

		answerIsCorrect ? alert("Your answer is correct!") : alert("Your answer is incorrect, try again.");
	});
}

function checkAnswer(answer, correctAnswer) {
	if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
		return true;
	}
}

function shuffler(answers) {
	let shuffled = answers
		.map((answer) => ({ answer, id: Math.random() * 4 }))
		.sort((a, b) => a.id - b.id)
		.map(({ answer }) => answer);

	return shuffled;
}
