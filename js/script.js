let playerName = "";
let playerPoints = 0;
let answer;
let answerCorrect = false;
let questions = [];

requestsPlayerName();

function requestsPlayerName() {
	playerName = prompt("Insert your name");
	showPlayerName();
}

function showPlayerName() {
	// Mostrar el nombre del jugador en pantalla editando el texto de #player
	alert(`Welcome ${playerName} to Quiz game`);
}

function getQuestions() {
	questions = [];

	// Obtener las preguntas por API https://opentdb.com/api.php?amount=10&type=multiple
	questions.push(
		"Which of these levels does NOT appear in the console/PC versions of the game &quot;Sonic Generations&quot;?\n1 - City Escape\n2 - Planet Wisp\n3 - Mushroom Hill\n4 - Sky Sanctuary\n"
	);
}

function makeQuestion() {
	getQuestions();

	questions.forEach((q) => {
		answer = prompt(q);

		answerCorrect = checkAnswer(answer, "3");

		if (answerCorrect) {
			alert("Your answer is correct!");
		} else {
			alert("Your answer is incorrect, try again.");
		}
	});
}

function checkAnswer(answer, correctAnswer) {
	if (answer === correctAnswer) {
		return true;
	}
}
