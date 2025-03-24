import { getPlaylist, getPlaylistItems }  from "./playlist.js";
import Playlists from "./storage.js";

/* TO-DO
    1. verify playlist entered into dialog#playlists is accessbile from youtube.
    2. create loading saved playlists feature.
    3. create saving/loaing scores feature.
    4. possibly involve json.bin in voting feature.
*/

/* ORDER OF OPERATIONS
    1. await youtube api.
    2. await saved playlists from local storage.
    3. only show the playlists dialog.
    4. check if the user chose or entered a valid playlist url
    5. check if the playlist id exists in local storage "playlists"
    6. if playlist exists load from local storage, if not get playlist data and save to local storage.
    7. 
*/

/* CLIP */
const clipDialog = document.querySelector('#clip');
const clipDialogForm = clipDialog.querySelector('form');
const clipDialogList = clipDialog.querySelector('ul');
/* PLAYLIST */
const PLAYLIST_ID = 'PL43FMwNG9HjfIPlTrM2UKMGCnStuyV8yD';
const playlists = new Playlists('playlists');
const playlistsButton = document.querySelector('#playlists-button');
const playlistsDialog = document.querySelector('#playlists');
const playlistsSelection = playlistsDialog.querySelector('select');
let currentId;
let player;
/* TABLE */
const table = document.querySelector('table');
/* WEIGHTS */
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
const weightsButton = document.querySelector('#weights-button');
const weightsDialog = document.querySelector('#weights');
const weightsList = weightsDialog.querySelector('ol');

window.onYouTubeIframeAPIReady = function() {
    const playlistOptions = createPlaylistsOptions(playlists.playlists);
    playlistsSelection.append(...playlistOptions);
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        playerVars: {
            listType: 'playlist',
            list: PLAYLIST_ID,
            autoplay: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

console.log(await getPlaylist(PLAYLIST_ID));

if(!playlists.isPlaylist(PLAYLIST_ID)) {
    const data = await getPlaylistItems(PLAYLIST_ID);
    const playlist = await getPlaylist(PLAYLIST_ID);
    const name = playlist.items[0].snippet.title;
    const videos = data.items.map(item => (
        {
            id: item.snippet.resourceId.videoId,
            name: item.snippet.title,
            position: item.snippet.position
        }
    ));
    playlists.addPlaylist(PLAYLIST_ID, name, videos);
    playlists.save();
}

const PLAYLIST_DATA = playlists.getPlaylist(PLAYLIST_ID);
const clips = PLAYLIST_DATA.videos.map(video => {
    weights.forEach(weight => {
        const property = weight.name.toLocaleLowerCase().replace(' ', '');
        video[property] = 0;
    });
    return video;
});

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

function onPlayerReady(event) {
    console.log(event)
    updateWeightsList(weights)
    updateTable(clips, weights);
}

// Player state change event handler
function onPlayerStateChange(event) {
    if(event.data === 1) {
        const clip = clips.find(clip => clip.name === event.target.videoTitle);
        updateClipDialog(clip);
    }
}

clipDialog.addEventListener('close', handleClipDialog)
clipDialogForm.addEventListener('submit', handleClipDialog);
playlistsButton.addEventListener('click', handlePlaylistsDialog);
table.addEventListener('click', handleTableClick);
weightsDialog.addEventListener('change', handleWeightChange);
weightsButton.addEventListener('click', handleWeightsDialog);
window.addEventListener('click', handleButtons);

const properties = weights.map(weight => weight.name).sort((a,b) => a.localeCompare(b));
const propertyControls = createClipPropertyControls(properties);
clipDialogList.append(...propertyControls);

function createClipPropertyControls(properties) {
    return properties.map(property => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        const label = document.createElement('label');
        const slug = property.toLowerCase().replace(' ', '-');
        // update input
        input.id = slug;
        input.name = slug;
        input.min = 0;
        input.placeholder = 0;
        input.setAttribute('value', 0);
        input.type = 'number';
        if(property === 'Medal') {
            input.max = 10;
        }
        // update label
        label.setAttribute('for', slug);
        label.textContent = property;
        // update li
        li.classList.add('control');
        li.append(label, input);
        return li;
    })
}

function createPlaylistsOptions(playlists) {
    return playlists.map(playlist => {
        const option = document.createElement('option');
        option.textContent = playlist.name;
        option.value = playlist.id;
        return option;
    })
}

function createRows(ratings) {
    return ratings.map((rating, index) => {
        const row = document.createElement('tr');
        const medalCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const rankingCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        // update dom
        medalCell.textContent = rating.medal || 0;
        nameCell.textContent = rating.name;
        rankingCell.textContent = index + 1;
        scoreCell.textContent = rating.score || 0;
        // update row
        row.append(rankingCell, nameCell, medalCell, scoreCell);
        return row;
    });
}

function handleButtons(event) {
    const button = event.target.closest('button[name="action"][value="close"]');
    if(!button) return;
    event.target.closest('dialog')?.close();
}

function handleClipDialog(event) {
    //console.log(event);
    if(event.type === 'submit') {
        event.preventDefault();
        updateClip(currentId);
    }

    if(event.type === 'close')  {
        player.pauseVideo();
    }
}

function handlePlaylistsDialog(event) {
    playlistsDialog.showModal();
}

function handleTableClick(event) {
    const tr = event.target.closest('tbody tr');
    if(!tr) return;
    const clip = clips.find(clip => clip.name === tr.children[1].textContent);
    if(!clip) return;
    player.playVideoAt(clip.position);
    //player.pauseVideo();
    clipDialog.showModal();
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

function handleWeightsDialog(event) {
    weightsDialog.showModal();
}

function normalizeToRange(x, minX, maxX, minY = 0, maxY = 10) {
    return ((x - minX) / (maxX - minX)) * (maxY - minY) + minY;
}

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

function updateClip(id) {
    const clip = clips.find(clip => clip.id === id)
    if(!clip) return;
    propertyControls.forEach(control => {
        const property = control.children[1].id.replace('-', '');
        const value = control.children[1].valueAsNumber;
        if(value !== clip[property]) {
            clip[property] = value;
        }
    });
    updateTable(clips, weights);
}

function updateClipDialog(clip) {
    currentId = clip.id;
    clipDialog.querySelector('h2').textContent = clip.name;
    propertyControls.forEach(control => {
        const input = control.children[1];
        const property = input.id.replace('-', '');
        input.value = clip[property];
    });
}

function updateTable(clips, weights) {
    const ratings = rate(clips, weights);
    const rows = createRows(ratings);
    table.tBodies[0].replaceChildren(...rows);
}

function updateWeightsList(weights) {
    const items = weights.sort((a,b) => b.value - a.value)
    .map(weight => {
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
        li.classList.add('control');
        return li;
    });
    weightsList.replaceChildren(...items);
};