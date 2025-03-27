import { getPlaylist, getPlaylistItems }  from "./playlist.js";
import Playlists from "./storage.js";

/* ELEMENTS */
const clipDialog = document.querySelector('#clip');
const clipDialogForm = clipDialog.querySelector('form');
const clipDialogList = clipDialog.querySelector('ul');
const playlistsButton = document.querySelector('#playlists-button');
const playlistsDialog = document.querySelector('#playlists');
const playlistsInput = playlistsDialog.querySelector('#playlist');
const playlistsSelection = playlistsDialog.querySelector('ul');
const table = document.querySelector('table');
const weightsDialog = document.querySelector('#weights');
const weightsList = weightsDialog.querySelector('ul');
/* CONSTS */
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
const PLAYLIST_ID = 'PL43FMwNG9HjfIPlTrM2UKMGCnStuyV8yD';
const playlists = new Playlists('playlists');
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
const properties = weights.map(weight => weight.name).sort((a,b) => a.localeCompare(b));
const propertyControls = createClipPropertyControls(properties);
/* LETS */
let currentId;
let player;

window.onYouTubeIframeAPIReady = () => {
    console.log('API READY')
    player = new YT.Player('player', {
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
}

clipDialog.addEventListener('close', handleClipDialog)
clipDialogForm.addEventListener('submit', handleClipDialog);
playlistsButton.addEventListener('click', handlePlaylistsDialog);
playlistsDialog.addEventListener('click', handlePlaylistsDialog);
playlistsDialog.addEventListener('submit', handlePlaylistsDialog);
table.addEventListener('touchend', handleTableClick);
table.addEventListener('click', handleTableClick);
weightsDialog.addEventListener('change', handleWeightChange);
window.addEventListener('click', handleButtons);
clipDialogList.append(...propertyControls);

// used to initialize the first example
await createPlaylist(PLAYLIST_ID);
const PLAYLIST_DATA = playlists.getPlaylist(PLAYLIST_ID);
const clips = createClips(PLAYLIST_DATA);
updateWeightsList(weights)
updateTable(clips, weights);
updatePlaylistsList(playlists.playlists);

function createClips(playlist) {
    return playlist.videos.map(video => {
        weights.forEach(weight => {
            const property = weight.name.toLocaleLowerCase().replace(' ', '');
            video[property] = 0;
        });
        return video;
    });
}

async function createPlaylist(id) {
    if(!playlists.isPlaylist(id)) {
        const data = await getPlaylistItems(id);
        const playlist = await getPlaylist(id);
        const name = playlist.items[0].snippet.title;
        const videos = data.items.map(item => (
            {
                id: item.snippet.resourceId.videoId,
                name: item.snippet.title,
                position: item.snippet.position,
                thumbnails: item.snippet.thumbnails
            }
        ));
        playlists.addPlaylist(id, name, videos);
        playlists.save();
    }
}

function createPlaylistsOptions(playlists) {
    return playlists.map(playlist => {
        const button = document.createElement('button');
        const li = document.createElement('li');
        button.name = 'playlist';
        button.textContent = playlist.name;
        button.value = playlist.id;
        li.append(button);
        return li;
    })
}

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

function createRows(ratings) {
    return ratings.map((rating, index) => {
        const ul = document.createElement('ul');
        const row = document.createElement('tr');
        const attributesCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const rankingCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        const thumbnailImage = document.createElement('img');
        const thumbnailCell = document.createElement('td');
        // update dom
        nameCell.textContent = rating.name;
        rankingCell.textContent = index + 1;
        scoreCell.textContent = rating.score || 0;
        thumbnailImage.height = 60;
        thumbnailImage.src = rating.thumbnail;
        thumbnailImage.width = 80;
        thumbnailCell.append(thumbnailImage);
        ul.classList.add('pills');
        for(const property in rating) {
            if(['id', 'name', 'position', 'score', 'thumbnail', 'thumbnails'].includes(property)) continue;
            if(rating[property] < 1 || rating[property] === undefined) continue;
            const li = document.createElement('li');
            li.textContent = `${property}: ${rating[property]}`;
            ul.append(li);
        }
        attributesCell.append(ul);
        // update row
        row.append(rankingCell, thumbnailCell, nameCell, attributesCell, scoreCell);
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
    switch(event.type) {
        case 'click':
            if(event.target.value === 'open') {
                playlistsDialog.showModal();
            }
            if(event.target.name === 'playlist') {
                console.log(event.target.value);
            }
            break;
        case 'submit':
            // get youtube playlist id from input
            const ID = event.target.playlist.value.split('list=')[1];
            // proccess playlist data into local storage
            createPlaylist(ID);
            // reload saved playlists list
            updatePlaylistsList(playlists.playlists);
            // focus new playlist button
            event.target.reset();
            playlistsSelection.lastElementChild.focus();
            break
    }
}

function handleTableClick(event) {
    const tr = event.target.closest('tbody tr');
    if(!tr) return;
    const name = tr.children[2].textContent;
    const clip = clips.find(clip => clip.name === name);
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

function normalizeToRange(x, minX, maxX, minY = 0, maxY = 10) {
    return ((x - minX) / (maxX - minX)) * (maxY - minY) + minY;
}

function onPlayerReady(event) {

}

// Player state change event handler
function onPlayerStateChange(event) {
    if(event.data === 1) {
        const clip = clips.find(clip => clip.name === event.target.videoTitle);
        updateClipDialog(clip);
    }
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

        clip.medal = medals[clip.medal];
        clip.score = score;
        clip.thumbnail = clip.thumbnails.default.url

        return clip;

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

function updatePlaylistsList(playlists) {
    const playlistOptions = createPlaylistsOptions(playlists);
    playlistsSelection.append(...playlistOptions);
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