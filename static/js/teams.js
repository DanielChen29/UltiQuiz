async function main() {
    const division = window.location.pathname.split("/").pop();

    let rows, rankings;

    if (division.substring(0,2) == 'd1') {
        rows = 20
        rankings = ['1', '2', '3T', '3T', '5T', '5T', '5T', '5T', 
            '9T', '9T', '9T', '9T', '13T', '13T', '15T', '15T', 
            '17T', '17T', '19T', '19T'];
    } else { // d3
        rows = 16
        rankings = ['1', '2', '3T', '3T', '5T', '5T', '7T', '7T', 
            '9', '10', '11', '12', '13', '14', '15', '16',];
    }

    const res = await fetch('/api/teams/' + division);
    const teams = await res.json();
    const container = document.getElementById('quiz-container');

    create_quiz_table(rows, rankings);

    const start_button = document.getElementById("start-button");
    const input_box = document.getElementById('input-box');
    const input_label = document.getElementById('input-label');

    start_button.addEventListener('click', () => {
        start_button.style.display = 'none';
        input_label.style.display = 'block';
        input_box.style.display = 'block';
        input_box.focus();
    });

    const found = [];
    const state = {matches: 0};
    input_box.addEventListener('input', () =>
        check_input(input_box, container, teams, rows, state, found)
    );
}


function create_quiz_table(rows, rankings) {
    const container = document.getElementById('quiz-container');

    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            const td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.padding = '8px';

            if (j == 0) {
                td.textContent = rankings[i];
            } else {
                td.textContent = '';
            }
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    container.appendChild(table);
}

function check_input(str, container, teams, rows, state, found) {
    const table = container.querySelector('table');

    const match = teams.find(team => team.aliases.some(alias => alias.toLowerCase() === str.value.toLowerCase()));

    if (match && found.indexOf(match.id) == -1) {
        found.push(match.id);

        const school_cell = table.rows[match.id - 1].cells[1];
        school_cell.textContent = match.school;

        const name_cell = table.rows[match.id - 1].cells[2];
        name_cell.textContent = match.teamname;

        state.matches++;
        const score = document.getElementById("score");
        score.textContent = "Score: " + state.matches + "/" + rows;

        str.value = '';
    }
}

document.addEventListener("DOMContentLoaded", main);