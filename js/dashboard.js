let players = [];

$("#load-btn").click(() => {
	loadDashboard();
	$("#load-btn").text("Reload Dashboard");
});

async function loadDashboard() {
	$("#tbody").empty();

	$("#loading-spinner").show();

	await getPlayers();
	$("#loading-spinner").hide();

	let i = 1;

	players.sort((a, b) => b.points - a.points);

	players.forEach((player) => {
		$("#tbody").append(`
		<tr>
			<th scope="row">${i}</th>
			<td>${player.name}</td>
			<td>${player.points}</td>
			<td>${player.time}</td>
		</tr>
		`);

		i++;
	});
}

async function getPlayers() {
	players = [];
	await db
		.collection("players")
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((el) => {
				players.push(el.data().player);
			});
		});
}
