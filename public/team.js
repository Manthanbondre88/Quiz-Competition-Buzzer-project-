const socket = io();

const params = new URLSearchParams(window.location.search);
const team = params.get("team");
socket.emit("registerTeam", team);

const teamName = document.getElementById("teamName");
const buzzBtn = document.getElementById("buzzBtn");
const status = document.getElementById("status");

teamName.innerText = `TEAM ${team}`;

// // Register this team as connected
// socket.emit("registerTeam", team);

buzzBtn.addEventListener("click", () => {
  socket.emit("buzz", team);

  buzzBtn.disabled = true;
  status.innerText = "Buzzed!";
});

socket.on("winner", (winningTeam) => {

  if (winningTeam == team) {
    status.innerText = "🎉 YOU BUZZED FIRST!";
  } else {
    status.innerText = `Team ${winningTeam} buzzed first!`;
    buzzBtn.disabled = true;
  }

});

socket.on("reset", () => {
  buzzBtn.disabled = false;
  status.innerText = "Ready...";
});