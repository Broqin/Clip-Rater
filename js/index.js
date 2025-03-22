const clipDialog = document.querySelector('#clip');
const table = document.querySelector('table');
const weightsButton = document.querySelector('#weights-button');
const weightsDialog = document.querySelector('#weights');
const weightsDialogButton = weightsDialog.querySelector('header > button');
const weightsList = weightsDialog.querySelector('ol');

const clips = [
    {
        "id": 0,
        "name": "Clip4",
        "afk": 1,
        "headshots": 3,
        "noScopes": 2,
        "collats": 0,
        "medal": 4,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 1
    },
    {
        "id": 1,
        "name": "Clip14",
        "afk": 0,
        "headshots": 1,
        "noScopes": 0,
        "collats": 0,
        "medal": 4,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 1,
        "bodyshots": 4
    },
    {
        "id": 2,
        "name": "Clip5",
        "afk": 0,
        "headshots": 4,
        "noScopes": 0,
        "collats": 0,
        "medal": 6,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 4
    },
    {
        "id": 3,
        "name": "Clip11",
        "afk": 0,
        "headshots": 0,
        "noScopes": 0,
        "collats": 0,
        "medal": null,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 0
    },
    {
        "id": 4,
        "name": "Clip6",
        "afk": 0,
        "headshots": 3,
        "noScopes": 1,
        "collats": 0,
        "medal": 5,
        "shotgun": 1,
        "melee": 0,
        "exterminations": 0,
        "misses": 2,
        "bodyshots": 4
    },
    {
        "id": 5,
        "name": "Clip15",
        "afk": 2,
        "headshots": 6,
        "noScopes": 0,
        "collats": 0,
        "medal": 8,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 3
    },
    {
        "id": 6,
        "name": "Clip1",
        "afk": 0,
        "headshots": 5,
        "noScopes": 1,
        "collats": 0,
        "medal": 7,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 3
    },
    {
        "id": 7,
        "name": "Clip2",
        "afk": 0,
        "headshots": 4,
        "noScopes": 0,
        "collats": 0,
        "medal": 4,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 1,
        "misses": 0,
        "bodyshots": 0
    },
    {
        "id": 8,
        "name": "Clip3",
        "afk": 0,
        "headshots": 4,
        "noScopes": 0,
        "collats": 1,
        "medal": 4,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 0
    },
    {
        "id": 9,
        "name": "Clip13",
        "afk": 0,
        "headshots": 5,
        "noScopes": 4,
        "collats": 0,
        "medal": 6,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 1,
        "bodyshots": 2
    },
    {
        "id": 10,
        "name": "Clip10",
        "afk": 2,
        "headshots": 5,
        "noScopes": 0,
        "collats": 0,
        "medal": 6,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 1,
        "bodyshots": 3
    },
    {
        "id": 11,
        "name": "Clip12",
        "afk": 0,
        "headshots": 4,
        "noScopes": 1,
        "collats": 0,
        "medal": 4,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 0
    },
    {
        "id": 12,
        "name": "Clip7",
        "afk": 0,
        "headshots": 4,
        "noScopes": 0,
        "collats": 0,
        "medal": 4,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 2,
        "bodyshots": 0
    },
    {
        "id": 13,
        "name": "Clip9",
        "afk": 0,
        "headshots": 6,
        "noScopes": 0,
        "collats": 0,
        "medal": 6,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 0
    },
    {
        "id": 14,
        "name": "Clip8",
        "afk": 0,
        "headshots": 6,
        "noScopes": 0,
        "collats": 0,
        "medal": 6,
        "shotgun": 0,
        "melee": 0,
        "exterminations": 0,
        "misses": 0,
        "bodyshots": 0
    }
]

const medals = {
    2: "Double Kill",
    3: "Triple Kill",
    4: "Overkill",
    5: "Killtacular",
    6: "Killtrocity",
    7: "Killimanjaro",
    8: "Killtastrophe",
    9: "Killpocalypse",
    10: "Killionaire"
};

const weights = [
    {
        id: 1,
        name: 'AFK',
        value: -3
    },
    {
        id: 2,
        name: 'Collats',
        value: 3
    },
    {
        id: 3,
        name: 'Exterminations',
        value: 4
    },
    {
        id: 4,
        name: 'Misses',
        value: -1
    },
    {
        id: 5,
        name: 'Body Shots',
        value: 0
    },
    {
        id: 6,
        name: 'Head Shots',
        value: 2
    },
    {
        id: 7,
        name: 'No Scopes',
        value: 1
    },
    {
        id: 8,
        name: 'Shotgun',
        value: 0
    },
    {
        id: 9,
        name: 'Melee',
        value: 0
    },
    {
        id: 10,
        name: 'Medal',
        value: 1
    }
];

weights.sort((a, b) => b.value - a.value);

const listItems = weights.map(weight => {
    // create dom
    const input = document.createElement('input');
    const label = document.createElement('label');
    const li = document.createElement('li');
    const output = document.createElement('output');
    const slug = weight.name.toLowerCase().replace(' ', '-');
    // update input
    input.id = slug;
    input.max = 10;
    input.min = -10;
    input.type = 'range';
    input.value = weight.value;
    // update label
    label.setAttribute('for', slug);
    label.textContent = weight.name;
    // update output
    output.setAttribute('for', slug);
    output.textContent = weight.value;
    // update li
    li.append(label, input, output);

    return li;
});

table.addEventListener('click', handleTableClick);

const tableRows = rate(clips, weights).map((rating, index) => {
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    const medalCell = document.createElement('td');
    const nameCell = document.createElement('td');
    const rankingCell = document.createElement('td');
    const scoreCell = document.createElement('td');
    // update dom
    idCell.textContent = rating.id + 1;
    medalCell.textContent = rating.medal;
    nameCell.textContent = rating.name;
    rankingCell.textContent = index + 1;
    scoreCell.textContent = rating.score;
    // update row
    row.append(rankingCell, idCell, nameCell, medalCell, scoreCell);
    return row;
});

table.tBodies[0].replaceChildren(...tableRows);
weightsList.replaceChildren(...listItems);

weightsDialog.addEventListener('change', handleWeightChange);
weightsDialogButton.addEventListener('click', handleWeightsDialog);
weightsButton.addEventListener('click', handleWeightsDialog);

console.log(rate(clips, weights));

function rate(clips, weights) {
    return clips.map(clip => {

        let score = 0;

        weights.forEach(weight => {
            const clipValue = clip[weight.name.toLowerCase().replace(' ', '')]; // Match the property name
            if (clipValue !== undefined) {
                score += clipValue * weight.value;
            }
        })

        return { id: clip.id, name: clip.name, medal: medals[clip.medal], score: score };

    }).sort((a, b) => b.score - a.score);
}

function handleWeightChange(event) {
    const name = event.target.id.replace('-', '');
    const weight = weights.find(weight => weight.name.toLowerCase().replace(' ', '') === name);
    if(!weight) return;
    weight.value = event.target.valueAsNumber;
    event.target.nextElementSibling.textContent = weight.value;
    // re rate
    const ratings = rate(clips, weights);
    console.log(ratings)
    const rows = createRows(ratings);
    table.tBodies[0].replaceChildren(...rows);
    // update weightlist
    // update table
}

function handleWeightsDialog() {
    if (weightsDialog.open) {
        weightsDialog.close();
    } else {
        weightsDialog.showModal();
    }
}

function normalizeToRange(x, minX, maxX, minY = 0, maxY = 10) {
    return ((x - minX) / (maxX - minX)) * (maxY - minY) + minY;
}

function createRows(ratings) {
    const rows = ratings.map((rating, index) => {
        const row = document.createElement('tr');
        const idCell = document.createElement('td');
        const medalCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const rankingCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        // update dom
        idCell.textContent = rating.id + 1;
        medalCell.textContent = rating.medal;
        nameCell.textContent = rating.name;
        rankingCell.textContent = index + 1;
        scoreCell.textContent = rating.score;
        // update row
        row.append(rankingCell, idCell, nameCell, medalCell, scoreCell);
        return row;
    });
    return rows;
}

function handleTableClick(event) {
    const tr = event.target.closest('tbody tr');
    if(!tr) return;
    const clip = clips.find(clip => clip.name === tr.children[2].textContent);
    if(!clip) return;
    clipDialog.querySelector('h2').textContent = clip.name;
    const rows = [];
    for(const property in clip) {
        const td = document.createElement('td');
        const th = document.createElement('th');
        const tr = document.createElement('tr');
        td.textContent = clip[property];
        th.textContent = property;
        tr.append(th, td);
        rows.push(tr);
    }
    clipDialog.querySelector('tbody').replaceChildren(...rows);
    clipDialog.showModal();
}