document.addEventListener("DOMContentLoaded", function () {
    const teamTitle = document.getElementById("teamTitle");
    const playerNameInput = document.getElementById("playerNameInput");
    const playerTypeSelect = document.getElementById("playerTypeSelect");
    const addPlayerBtn = document.getElementById("addPlayerBtn");
    const playersContainer = document.getElementById("playersContainer");

    const selectedTeam = localStorage.getItem("selectedTeam");
    if (!selectedTeam) {
        alert("No team selected!");
        return;
    }

    teamTitle.textContent = selectedTeam;

    let teams = JSON.parse(localStorage.getItem("teams")) || [];

    let currentTeam = teams.find(team => team.name === selectedTeam);

    // If team not found, create it
    if (!currentTeam) {
        currentTeam = { name: selectedTeam, players: [] };
        teams.push(currentTeam);
    }

    // Ensure players array exists
    if (!currentTeam.players) {
        currentTeam.players = [];
    }

    let isEditing = false;
    let editingIndex = null;

    function saveTeams() {
        localStorage.setItem("teams", JSON.stringify(teams));
    }

    function displayPlayers() {
        playersContainer.innerHTML = "";

        currentTeam.players.forEach((player, index) => {
            const playerDiv = document.createElement("div");
            playerDiv.classList.add("player");

            playerDiv.innerHTML = `
                <div class="info-row">
                    <h3>${player.name}</h3>
                    <button class="edit-btn btn btn-warning btn-sm" data-index="${index}">Edit</button>
                </div>
                <div class="info-row">
                    <p>${player.type}</p>
                    <button class="delete-btn btn btn-danger btn-sm" data-index="${index}">Delete</button>
                </div>
                <button class="view-btn btn btn-info btn-sm mt-2">View</button>
            `;

            playersContainer.appendChild(playerDiv);
        });

        // Add event listeners after rendering
        document.querySelectorAll(".edit-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                const player = currentTeam.players[index];
                playerNameInput.value = player.name;
                playerTypeSelect.value = player.type;
                isEditing = true;
                editingIndex = index;
                addPlayerBtn.textContent = "Update";
            });
        });

        document.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                currentTeam.players.splice(index, 1);
                saveTeams();
                displayPlayers();
            });
        });

        document.querySelectorAll(".view-btn").forEach((btn, idx) => {
            btn.addEventListener("click", function () {
                alert(`Viewing Player: ${currentTeam.players[idx].name}`);
            });
        });
    }

    addPlayerBtn.addEventListener("click", function () {
        const name = playerNameInput.value.trim();
        const type = playerTypeSelect.value;

        if (!name || type === "Select") {
            alert("Please enter name and type.");
            return;
        }

        if (isEditing) {
            currentTeam.players[editingIndex] = { name, type };
            isEditing = false;
            editingIndex = null;
            addPlayerBtn.textContent = "ADD";
        } else {
            currentTeam.players.push({ name, type });
        }

        saveTeams();
        displayPlayers();
        playerNameInput.value = "";
        playerTypeSelect.value = "Select";
    });

    // Initial display
    displayPlayers();
});
