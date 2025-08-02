async function load_quiz(quiz) {
    const res = await fetch('/api/' + quiz);
    const teams = await res.json();
    const container = document.getElementById('quiz-container');
    teams.forEach(team => {
        const p = document.createElement('p');
        p.textContent = team.school;
        container.appendChild(p);
    })
}

function create_quiz_table(rows) {
    const container = document.getElementById('quiz-container');

    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';

    for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');

        for (let j = 0; j < 2; j++) {
            const td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.padding = '8px';
            td.textContent = '';
            tr.appendChild(td);
        }

        table.appendChild(tr);
    }

    container.appendChild(table);
}

function populate_rankings(division) {
    rankings = []

    if (division == 'd1m' || division == 'd1w') {
        rankings = ['1', '2', '3T', '3T', '5T', '5T', '5T', '5T', 
            '9T', '9T', '9T', '9T', '13T', '13T', '15T', '15T', 
            '17T', '17T', '19T', '19T'];
    } else { //d3m or d3w
        rankings = ['1', '2', '3T', '3T', '5T', '5T', '7T', '7T', 
            '9', '10', '11', '12', '13', '14', '15', '16',];
    }

    const container = document.getElementById('quiz-container');
    const table = container.querySelector('table')
    
    for (let i = 0; i < rankings.length; i++) {
        const cell = table.rows[i].cells[0];
        cell.textContent = rankings[i]
    }
}

async function check_input(str) {
    const res = await fetch('/api/d1m');
    const teams = await res.json();
    const container = document.getElementById('quiz-container');
    const table = container.querySelector('table')
    
    const match = teams.find(team => team.school.toLowerCase() === str.value.toLowerCase());

    if (match) {
        const cell = table.rows[match.id - 1].cells[1];
        cell.textContent = match.teamname
    }
}

