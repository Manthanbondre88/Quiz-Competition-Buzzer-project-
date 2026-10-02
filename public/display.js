const socket = io();

const winner = document.getElementById("winner");
const buzzerSound = document.getElementById("buzzerSound");

console.log("Display connected to server");


// ===============================
// WINNER + BUZZER SOUND
// ===============================

socket.on("winner", (team) => {

    console.log("WINNER RECEIVED:", team);

    winner.innerText = `🚨 TEAM ${team} BUZZED FIRST!`;

    // Play buzzer immediately
    buzzerSound.currentTime = 0;

    buzzerSound.play()
        .then(() => {

            console.log("🔊 BUZZER PLAYING");

            setTimeout(() => {
                buzzerSound.pause();
                buzzerSound.currentTime = 0;
            }, 5000);

        })
        .catch((error) => {
            console.log("❌ BUZZER ERROR:", error);
        });
});


// ===============================
// RESET
// ===============================

socket.on("reset", () => {

    winner.innerText = "WAITING...";

});


// ===============================
// DEVICE CONNECTION STATUS
// ===============================

socket.on("deviceStatus", (teams) => {

    console.log("CONNECTED TEAMS:", teams);

    const teamStatus = document.getElementById("teamStatus");
    const connectedCount = document.getElementById("connectedCount");

    if (!teamStatus) return;

    teamStatus.innerHTML = "";

    connectedCount.innerText =
        `${teams.length} DEVICES CONNECTED`;

    // Show ONLY connected teams
    teams
        .sort((a, b) => Number(a) - Number(b))
        .forEach((team) => {

            const teamDiv = document.createElement("div");

            teamDiv.className = "team-status";

            teamDiv.innerHTML = `
                <div class="status-light green"></div>
                <div>TEAM ${team}</div>
            `;

            teamStatus.appendChild(teamDiv);
        });
});