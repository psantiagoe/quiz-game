$("#load-btn").click(() => {
	loadDashboard();
	$("#load-btn").text("Reload Dashboard");
});

function loadDashboard() {
	$("#tbody").empty();

	$.ajax({
		url: "../assets/database.json",
		data: {},
		type: "GET",
		success: function (response) {
			let i = 1;
			response.sort((a, b) => b.points - a.points);

			response.forEach((player) => {
				$("#tbody").append(`
				<tr>
					<th scope="row">${i}</th>
					<td>${player.player}</td>
					<td>${player.points}</td>
				</tr>
				`);

				i++;
			});
		},
	});
}
