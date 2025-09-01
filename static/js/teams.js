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

    const start_button = document.getElementById('start-button');

    const input_box = document.getElementById('input-box');
    const give_up_button = document.getElementById('give-up-button');
    const response_container = document.getElementById('response-container');

    console.log("response container:", response_container);

    const timer = document.getElementById("timer");
    let seconds = 180;  

    //listener for start button click
    start_button.addEventListener('click', () => {
        start_button.style.display = 'none';
        response_container.style.display = 'block';
        input_box.focus();

        //timer logic
        const timer_interval = setInterval(() => {
            seconds--;
            timer.textContent = format_time(seconds);
            if (seconds <= 0 || state.matches == rows) {
                clearInterval(timer_interval)
                end_quiz(response_container, timer, state, rows, teams, found)
            };
        }, 1000);
    });

    give_up_button.addEventListener('click', () => {
        end_quiz(response_container, timer, state, rows, teams, found);
    });

    const found = [];
    const state = {matches: 0};
    input_box.addEventListener('input', () =>
        check_input(input_box, container, teams, rows, state, found)
    );
    input_box.addEventListener('keydown', (e) => {
        if (e.key == 'Enter') check_input(input_box, container, teams, rows, state, found, true)
    });
}

/**
 * create the unfilled table for the given quiz
 * @param {int} rows - number of rows in the table
 * @param {list} rankings - rankings of the given teams
 */
function create_quiz_table(rows, rankings) {
    const table = document.getElementById('quiz-table');

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < 3; j++) {
            const td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.padding = '8px';
            td.style.textAlign = 'center';

            if (j == 0) td.style.width = '75px';
            if (j == 1) td.style.width = '150px';
            if (j == 2) td.style.width = '125px';

            if (j == 0) {
                td.textContent = rankings[i];
            } else {
                td.textContent = '';
            }
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }
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
 * @param {String} str - input string
 * @param {HTMLElement} container - input div
 * @param {list} teams - teams list
 * @param {int} rows - rows in table
 * @param {object} state - object storing number of correct guesses
 * @param {list} found - list of found teams
 * @param {boolean} enter_down - boolean if enter pressed
 */
function check_input(str, container, teams, rows, state, found, enter_down = false) {
    const table = container.querySelector('table');
    const false_message = document.getElementById("false-message");

    const match = teams.find(team => team.aliases.some(alias => alias.toLowerCase() === str.value.toLowerCase()));

    if (enter_down == true && str.value.trim() != "") {
        const false_message = document.getElementById("false-message");
        if (match) {
            false_message.textContent = "Already guessed: " + match.school + " " + match.teamname;
        } else {
            false_message.textContent = "Incorrect";
        }
    } else {
        false_message.textContent = "";
    }

    //if there is a match and it hasn't been found
    if (match && found.indexOf(match.rank) == -1) {
        found.push(match.rank);

        const school_cell = table.rows[match.rank].cells[1];
        school_cell.textContent = match.school;

        const name_cell = table.rows[match.rank].cells[2];
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
function end_quiz(response_container, timer, state, rows, teams, found) {
    response_container.style.display = 'none';
    timer.style.display = 'none';

    const not_found = [];

    console.log("found: ", found)

    teams.forEach(function(team) {
        const match = found.find(found_team => found_team === team.id);
        if (!match) not_found.push(team);
    });

    console.log("not found: ", not_found)

    const table = document.getElementById("quiz-table");
    not_found.forEach(function(team) {
        const school_cell = table.rows[team.rank].cells[1];
        school_cell.style.color = "red";
        school_cell.textContent = team.school;
    
        const name_cell = table.rows[team.rank].cells[2];
        name_cell.style.color = "red";
        name_cell.textContent = team.teamname;
    });

    const end_card = document.getElementById('end-card');
    end_card.textContent = "You scored " + state.matches + " out of " + rows;
    end_card.style.display = 'block';

    const play_again_button = document.getElementById('play-again');
    play_again_button.style.display = 'block';
    play_again_button.addEventListener('click', () => {
        window.location.reload();
    });
}

document.addEventListener("DOMContentLoaded", main);