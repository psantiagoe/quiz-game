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

$("#submit-name").click(() => {
	showPlayerName();
});

$("#start-btn").click(() => {
	lastPlayerPoint();
	restartGame();
	loadQuestions();
});

function showPlayerName() {
	const playerNameInput = $("#player-name-input").val();

	if ([null, undefined, ""].includes(playerNameInput)) {
		alert("Please insert a name to continue.");
	} else {
		$("#player").text(`Player: ${playerNameInput}`);

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

function getQuestions(url) {
	// get question from API
	$.ajax({
		beforeSend: () => {
			changeDisplay(["start-btn"], "none");
			changeDisplay(["loading-spinner"], "block");
		},
		url: url,
		data: {},
		type: "GET",
		success: function (response) {
			if (response !== "") {
				response.results.forEach((question) => {
					questions.push(
						new Question(
							question.category,
							question.difficulty,
							question.question,
							question.correct_answer,
							[
								{ id: 1, answer: question.incorrect_answers[0] },
								{ id: 2, answer: question.incorrect_answers[1] },
								{ id: 3, answer: question.incorrect_answers[2] },
								{ id: 4, answer: question.correct_answer },
							]
						)
					);
				});
			}

			// sort randomly
			for (let i = 0; i < questions.length; i++) {
				questions[i].answers = shuffler(questions[i].answers);
			}

			changeDisplay(["welcome", "loading-spinner"], "none");
			changeDisplay(["question-card"], "block");

			showQuestion();
		},
	});
}

function loadQuestions() {
	getQuestions(URLAPI.noCategory);
}

function showQuestion() {
	$("#question").html(questions[counter].question);

	$(".options").empty();

	// print options
	for (let i = 0; i < questions[counter].answers.length; i++) {
		const answer = questions[counter].answers[i].answer;
		const id = questions[counter].answers[i].id;

		$(".options").append(`<a id="option${id}" class="btn btn-primary">${answer}</a>`);
		$(`#option${id}`).click(() => {
			let answer = $(`#option${id}`).first().text();

			checkAnswer(answer, questions[counter - 1].correctAnswer);

			// Show next question
			if (counter !== 0) {
				showQuestion();
			} else {
				changeDisplay(["question-card"], "none");
				changeDisplay(["start-btn"], "inline-block");
				$("#start-btn").text("Star again");
			}
		});
	}

	// Update player status
	$("#question-counter").html(`Question ${++counter} of ${questions.length}`);
}

function checkAnswer(answer, correctAnswer) {
	let answerIsCorrect = false;

	if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
		answerIsCorrect = true;
	}

	if (answerIsCorrect) {
		alert("Your answer is correct!");
		$("#points").html(`Points: ${++point}`);
	} else {
		alert("Your answer is incorrect.");
	}

	// Reset counter when reach last question
	counter = counter === questions.length ? 0 : counter;
}

function shuffler(answers) {
	let shuffled = answers
		.map((answer) => ({ answer, sort: Math.random() * 4 }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ answer }) => answer);

	return shuffled;
}

function changeDisplay(elIds, value) {
	for (const elId of elIds) {
		$(`#${elId}`).css("display", value);
	}
}

function lastPlayerPoint() {
	sessionStorage.clear();

	sessionStorage.setItem("playerName", $("#player-name-input").val());
	let playerName = sessionStorage.getItem("playerName");

	sessionStorage.setItem("playerPoints", point);
	let playerPoints = sessionStorage.getItem("playerPoints");

	if (point !== 0) {
		$("#player-last-points").html(`Last play: ${playerName} | Points: ${playerPoints}`);
	}
}

function restartGame() {
	questions = [];
	counter = 0;
	point = 0;

	$("#points").html(`Points: 0`);
	$("#timer").html(`timer: 00:00`);
}
