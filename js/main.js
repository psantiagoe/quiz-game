let questions = [];
let counter = 0;
let point = 0;
let time = "";
let timer = null;
let urlCategorySelected = "";
let playerName = "";

const URLAPI = {
	random: "https://opentdb.com/api.php?amount=10&type=multiple",
	generalKnowledge: "https://opentdb.com/api.php?amount=10&category=9&type=multiple",
	film: "https://opentdb.com/api.php?amount=10&category=11&type=multiple",
	music: "https://opentdb.com/api.php?amount=10&category=12&type=multiple",
	videoGames: "https://opentdb.com/api.php?amount=10&category=15&type=multiple",
	computers: "https://opentdb.com/api.php?amount=10&category=18&type=multiple",
};

function Question(category, difficulty, question, correctAnswer, answers) {
	this.category = category;
	this.difficulty = difficulty;
	this.question = question;
	this.correctAnswer = correctAnswer;
	this.answers = answers;
}

$(document).ready(() => {
	playerName = sessionStorage.getItem("playerName");

	if (![null, undefined, ""].includes(playerName)) {
		showPlayerName();
	}
});

$("#submit-name").click((e) => {
	showPlayerName();
});

$("#start-btn").click(() => {
	restartGame();
	loadQuestions();
	$("#dropdownMenuButton").addClass("disabled");
});

$("#popup-close-btn").click(() => {
	changeDisplay(["popup"], false);
});

$(".category").click((e) => {
	selectCategory(e.target.innerText);
});

function showPlayerName() {
	if ([null, undefined, ""].includes(playerName)) {
		playerName = $("#player-name-input").val();
		storePlayerName();
	}

	if ([null, undefined, ""].includes(playerName)) {
		alert("Please insert a name to continue.");
	} else {
		$("#popup").prepend(`
			<p>We are pleased to give you a warm welcome ${playerName}
            	<br>
            	Let's start!
        	</p>
			`);

		$("#popup").fadeIn(1000).delay(2000).fadeOut(1500);

		$("#player").text(`Player: ${playerName}`);

		changeDisplay(["form-player"], false);
		changeDisplay(["status", "start-btn-container"], true);
	}
}

function getQuestions(url) {
	// get question from API
	$.ajax({
		beforeSend: () => {
			changeDisplay(["start-btn"], false);
			changeDisplay(["loading-spinner"], true);
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

			changeDisplay(["welcome", "loading-spinner"], false);

			showQuestion();
			startTimer();
		},
	});
}

function selectCategory(textBtn) {
	$("#start-btn").removeClass("disabled");
	$("#dropdownMenuButton").text(textBtn);

	textBtn = camelize(textBtn);

	urlCategorySelected = URLAPI[textBtn];
}

function loadQuestions() {
	getQuestions(urlCategorySelected);
}

function showQuestion() {
	$("#question-card").fadeIn(1000);
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
				$("#question-card").fadeOut(500).fadeIn(1000);

				let delay = setInterval(() => {
					showQuestion();
					clearInterval(delay);
				}, 500);
			} else {
				clearInterval(timer);

				$("#question-card").fadeOut(2000, () => {
					$("#start-btn").fadeIn(1000);
				});
				$("#start-btn").text("Start again");
				$("#dropdownMenuButton").removeClass("disabled");

				const player = {
					name: playerName,
					points: point,
					time: time,
				};
				addPlayer(player);
			}
		});
	}

	// Update player status
	$("#question-counter").html(`Question ${++counter} of ${questions.length}`);
}

function checkAnswer(answer, correctAnswer) {
	let answerIsCorrect = false;

	if (answer.toLowerCase() === decodeEntities(correctAnswer.toLowerCase())) {
		answerIsCorrect = true;
	}

	counter === 0 ? $("#alert-answer").fadeIn() : false;

	if (answerIsCorrect) {
		$("#alert-answer").append(
			`<p id="alert${counter}" style="display: none;">Your answer is correct! &#128512;</p>`
		);
		$("#points").html(`Points: ${++point}`);
	} else {
		$("#alert-answer").append(
			`<p id="alert${counter}" style="display: none;">Your answer is incorrect. &#128517;</p>`
		);
	}

	$(`#alert${counter}`).slideDown(1000).delay(2000).slideUp(1500);

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

function changeDisplay(tagsIds, show) {
	for (const tagId of tagsIds) {
		if (show === true) {
			$(`#${tagId}`).show();
		} else {
			$(`#${tagId}`).hide();
		}
	}
}

function storePlayerName() {
	sessionStorage.clear();

	sessionStorage.setItem("playerName", $("#player-name-input").val());
	playerName = sessionStorage.getItem("playerName");
}

function restartGame() {
	questions = [];
	counter = 0;
	point = 0;

	$("#points").html(`Points: 0`);
	$("#timer").html(`Timer: 00:00`);
	$("#alert-answer").empty();
}

function startTimer() {
	let seconds = 0;
	let minutes = 0;

	timer = setInterval(function () {
		seconds++;

		if (seconds === 60) {
			seconds = 0;
			minutes++;
		}

		let txtMinutes = minutes.toString().padStart(2, 0);
		let txtSeconds = seconds.toString().padStart(2, 0);

		time = `${txtMinutes}:${txtSeconds}`;

		$("#timer").html(`Timer: ${time}`);
	}, 1000);
}

function camelize(string) {
	return string
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, "");
}

let decodeEntities = (function () {
	let element = document.createElement("div");

	function decodeHTMLEntities(str) {
		if (str && typeof str === "string") {
			str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
			str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gim, "");
			element.innerHTML = str;
			str = element.textContent;
			element.textContent = "";
		}

		return str;
	}

	return decodeHTMLEntities;
})();

function addPlayer(player) {
	db.collection("players").add({
		player,
	});
}
