// teams.js

let teamCount = 0;
let isEditing = false;
let currentEditDiv = null;

const teamForm = document.getElementById('teamForm');
const teamNameInput = document.getElementById('teamName');
const locationInput = document.getElementById('location');
const teamsContainer = document.getElementById('teamsContainer');
const createButton = document.getElementById('create_button');

// Load teams from localStorage
let teams = JSON.parse(localStorage.getItem('teams')) || [];
teamCount = teams.length;
teams.forEach((team, index) => {
  createTeamCard(team.name, team.location, index + 1);
});

teamForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const teamName = teamNameInput.value.trim();
  const location = locationInput.value.trim();

  if (!teamName || !location) return;

  if (isEditing && currentEditDiv) {
    const index = parseInt(currentEditDiv.dataset.index);
    teams[index] = { name: teamName, location };

    currentEditDiv.querySelector('p.teamName').textContent = teamName;
    currentEditDiv.querySelector('p.location').textContent = location;
    currentEditDiv.querySelector('.view-link').dataset.team = teamName;

    localStorage.setItem('teams', JSON.stringify(teams));
    resetForm();
  } else {
    const newTeam = { name: teamName, location };
    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));
    teamCount++;
    createTeamCard(teamName, location, teamCount);
    resetForm();
  }
});

function createTeamCard(name, location, number) {
  const index = number - 1;

  const teamDiv = document.createElement('div');
  teamDiv.className = 'teams';
  teamDiv.dataset.index = index;

  teamDiv.innerHTML = `
    <h3>Team ${number}</h3>
    <p class="teamName">${name}</p>
    <p class="location">${location}</p>
    <a href="./players.html" class="view-link" data-team="${name}">View</a>
    <div class="action-buttons">
      <button class="editBtn">Edit</button>
      <button class="deleteBtn">Delete</button>
    </div>
  `;

  teamDiv.querySelector('.editBtn').addEventListener('click', () => editTeam(teamDiv));
  teamDiv.querySelector('.deleteBtn').addEventListener('click', () => deleteTeam(teamDiv));

  teamDiv.querySelector('.view-link').addEventListener('click', function () {
    localStorage.setItem('selectedTeam', this.dataset.team);
  });

  teamsContainer.appendChild(teamDiv);
}

function editTeam(teamDiv) {
  const name = teamDiv.querySelector('.teamName').textContent;
  const location = teamDiv.querySelector('.location').textContent;

  teamNameInput.value = name;
  locationInput.value = location;

  isEditing = true;
  currentEditDiv = teamDiv;
  createButton.textContent = 'Update';
}

function deleteTeam(teamDiv) {
  if (confirm('Are you sure you want to delete this team?')) {
    const index = parseInt(teamDiv.dataset.index);
    teams.splice(index, 1);
    localStorage.setItem('teams', JSON.stringify(teams));

    teamsContainer.innerHTML = '';
    teamCount = 0;
    teams.forEach((team, idx) => createTeamCard(team.name, team.location, idx + 1));

    resetForm();
  }
}

function resetForm() {
  teamForm.reset();
  isEditing = false;
  currentEditDiv = null;
  createButton.textContent = 'Create';
}
