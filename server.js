const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let locked = false;
let winner = null;
let resetTimer = null;

// Track connected teams
let connectedTeams = new Set();

io.on("connection", (socket) => {

    console.log("Device connected");

    // Team registers itself
    socket.on("registerTeam", (team) => {

        socket.team = team;

        connectedTeams.add(team);

        console.log(`Team ${team} connected`);

        // Send connection status to display
        io.emit("deviceStatus", Array.from(connectedTeams));
    });


    // Send current winner to newly connected device
    if (locked && winner) {
        socket.emit("winner", winner);
    }


    // Team presses buzzer
    socket.on("buzz", (team) => {

        // Ignore other teams after first buzz
        if (locked) {
            return;
        }

        locked = true;
        winner = team;

        console.log(`Team ${team} buzzed first!`);

        // Send winner to ALL connected devices
        io.emit("winner", team);

        // Auto reset after 20 seconds
        resetTimer = setTimeout(() => {

            locked = false;
            winner = null;
            resetTimer = null;

            io.emit("reset");

            console.log("Buzzer automatically reset");

        }, 20000);
    });


    // Manual reset from display
    socket.on("reset", () => {

        locked = false;
        winner = null;

        if (resetTimer) {
            clearTimeout(resetTimer);
            resetTimer = null;
        }

        io.emit("reset");

        console.log("Buzzer manually reset");
    });


    // Device disconnected
    socket.on("disconnect", () => {

        if (socket.team) {

            connectedTeams.delete(socket.team);

            console.log(`Team ${socket.team} disconnected`);

            // Update display
            io.emit("deviceStatus", Array.from(connectedTeams));
        }

    });

});


server.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Server running on port 3000");
});