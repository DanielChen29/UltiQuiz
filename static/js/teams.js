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

    const title = document.getElementById("title")
    if (division === 'd1m') {
        title.textContent = "Can you name every team at 2025 D1 Men's Nationals?";
        } else if (division === 'd1w') {
        title.textContent = "Can you name every team at 2025 D1 Women's Nationals?";
        } else if (division === 'd3m') {
        title.textContent = "Can you name every team at 2025 D3 Men's Nationals?";
        } else { //d3w
        title.textContent = "Can you name every team at 2025 D3 Women's Nationals?";
    }

    const res = await fetch('/api/teams/' + division);
    const teams = await res.json();
    const container = document.getElementById('quiz-container');

    create_quiz_table(rows, rankings);

    console.log("Teams data:", teams);

    const start_button = document.getElementById("start-button");
    const input_box = document.getElementById('input-box');
    const input_label = document.getElementById('input-label');

    const timer = document.getElementById("timer");
    let seconds = 180;  

    //listener for start button click
    start_button.addEventListener('click', () => {
        start_button.style.display = 'none';
        input_label.style.display = 'block';
        input_box.style.display = 'block';
        input_box.focus();

        //timer logic
        const timer_interval = setInterval(() => {
            seconds--;
            timer.textContent = format_time(seconds);
            if (seconds <= 0 || state.matches == rows) {
                clearInterval(timer_interval)
                end_quiz(input_box, input_label, timer, state, rows)
            };
        }, 1000);
    });

    const found = [];
    const state = {matches: 0};
    input_box.addEventListener('input', () =>
        check_input(input_box, container, teams, rows, state, found)
    );
}

/**
 * create the unfilled table for the given quiz
 * @param {int} rows - number of rows in the table
 * @param {list} rankings - rankings of the given teams
 */
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

/**
 * convert a number of seconds into minutes and seconds
 * @param {int} seconds 
 * @returns time in minutes and seconds
 */
function format_time(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ":" + s.toString().padStart(2, '0');
}

/**
 * check whether a given guess in the input box corresponds to a team alias
 * if so, fill in table and update score
 * @param {String} str 
 * @param {HTMLElement} container 
 * @param {list} teams 
 * @param {int} rows 
 * @param {object} state 
 * @param {list} found 
 */
function check_input(str, container, teams, rows, state, found) {
    const table = container.querySelector('table');

    const match = teams.find(team => team.aliases.some(alias => alias.toLowerCase() === str.value.toLowerCase()));

    //if there is a match and it hasn't been found
    if (match && found.indexOf(match.rank) == -1) {
        found.push(match.rank);

        const school_cell = table.rows[match.rank - 1].cells[1];
        school_cell.textContent = match.school;

        const name_cell = table.rows[match.rank - 1].cells[2];
        name_cell.textContent = match.teamname;

        state.matches++;
        const score = document.getElementById("score");
        score.textContent = "Score: " + state.matches + "/" + rows;

        str.value = '';
    }
}

/**
 * when time runs out or all teams have been found or user gives up, end quiz and display score
 * @param {HTMLElement} input_box 
 * @param {HTMLElement} input_label 
 * @param {HTMLElement} timer 
 * @param {object} state 
 * @param {int} rows 
 */
function end_quiz(input_box, input_label, timer, state, rows) {
    input_box.style.display = 'none';
    input_label.style.display = 'none';
    timer.style.display = 'none';

    const end_card = document.getElementById('end-card');
    end_card.textContent = "You scored " + state.matches + " out of " + rows
    end_card.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", main);