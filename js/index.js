import { getPlaylist, getPlaylistItems }  from "./playlist.js";
import Playlists from "./storage.js";
import { View } from "./view.js";

/* ELEMENTS */
const clipDialog = document.querySelector('#clip');
const clipDialogForm = clipDialog.querySelector('form');
const table = document.querySelector('table');
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
/* LETS */
let currentId;
let player;

window.onYouTubeIframeAPIReady = () => {
    //console.log('API READY')
    player = new YT.Player('player', {
        playerVars: {
            autoplay: 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function createClips(videos) {
    return videos.map(video => {
    // create shallow copy of video
        const clip = {...video};
        // apply attributes based on weights
        weights.forEach(weight => {
            // remove spaces from weight name to use as attribute
            const property = weight.name.toLocaleLowerCase().replace('/\s+/g', '');
            // set attribute
            clip[property] = 0;
        });
        return clip;
    });
}

async function createPlaylist(id) {
    if(!playlists.isPlaylist(id)) {
        const data = await getPlaylistItems(id);
        const playlist = await getPlaylist(id);
        const name = playlist.items[0].snippet.title;
        const videos = data.items.map(item => {
            const video = {
                id: item.snippet.resourceId.videoId,
                name: item.snippet.title,
                position: item.snippet.position,
                thumbnails: item.snippet.thumbnails
            };

            return video;
        });
        playlists.addPlaylist(id, name, videos);
        playlists.save();
    }
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

async function handleAddPlaylist(event) {
    event.preventDefault();
    // get youtube playlist id from input
    const ID = event.target.playlist.value.split('list=')[1];
    // proccess playlist data into local storage
    await createPlaylist(ID);
    // reload saved playlists list
    View.createPlaylistsOptions(playlists.playlists.length);
    View.setPlaylistsOptions(playlists.playlists);
    // focus new playlist button
    event.target.reset();
}

function handleSelectPlaylist(event) {
    const button = event.target.closest('button');
    if(!button || button.name !== 'playlist') return;
    const ID = event.target.value;
    setPlaylist(ID);
}

function handleTableClick(event) {
    const tr = event.target.closest('tbody tr');
    if(!tr) return;
    const name = tr.children[2].textContent;
    const { videos } = playlists.getCurrentPlaylist();
    const clip = videos.find(clip => clip.name === name);
    if(!clip) return;
    player.playVideoAt(clip.position);
    clipDialog.showModal();
}

function handleWeightChange(event) {
    const name = event.target.id.replace('-', '');
    const weight = weights.find(weight => weight.name.toLowerCase().replace(' ', '') === name);
    if(!weight) return;
    weight.value = event.target.valueAsNumber;
    event.target.nextElementSibling.textContent = weight.value;
    if(!playlists.getCurrentPlaylist()) return;
    const { videos } = playlists.getCurrentPlaylist();
    if(!videos) return;
    const ratings = rate(videos, weights);
    const rows = createRows(ratings);
    table.tBodies[0].replaceChildren(...rows);
}

async function initialize() {
    // initialize view
    View.createPlaylistsOptions(playlists.playlists.length);
    View.setPlaylistsOptions(playlists.playlists);
    View.playlistsButton.disabled = false;
    View.updateWeightsList(weights);
    View.createAttributesControls(weights.length);
    View.updateAttributeControls(weights.map(weight => ({ name: weight.name, value: 0 })));
    // attach event listeners
    clipDialog.addEventListener('close', handleClipDialog)
    clipDialogForm.addEventListener('submit', handleClipDialog);
    View.playlistsDialog.addEventListener('click', handleSelectPlaylist);
    View.playlistsDialog.addEventListener('submit', handleAddPlaylist);
    table.addEventListener('touchend', handleTableClick);
    table.addEventListener('click', handleTableClick);
    View.weightsForm.addEventListener('change', handleWeightChange);
    window.addEventListener('click', handleButtons);
}

function onPlayerReady(event) {
    //console.log('ready', event);
    initialize();
}

// Player state change event handler
function onPlayerStateChange(event) {
    //console.log('state:', event.data);

    if(event.data === -1) {
        View.attributesForm.disabled = true;
    }

    if(event.data === 3) {
        View.attributesForm.disabled = false;
    }

    if(event.data === 1) {
        //console.log('buffering', event.target.videoTitle);
        const name = event.target.videoTitle;
        const { videos } = playlists.getCurrentPlaylist();
        const clip = videos.find(video => video.name === name);
        if(clip) {
            updateClipDialog(clip);
        }
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

function setPlaylist(id) {
    //console.log('setting playlist id', id)
    const playlist = playlists.setPlaylist(id);
    if(!playlist) return;
    player.stopVideo();
    player.cuePlaylist({ listType: 'playlist', list: id });
    const clips = createClips(playlist.videos);
    updateTable(clips, weights);
}

function updateClip(id) {
    const { videos } = playlists.getCurrentPlaylist();
    const clip = videos.find(clip => clip.id === id);
    if(!clip) return;
    const controls = clipDialogForm.querySelectorAll('.control');
    controls.forEach(control => {
        const property = control.children[1].id.replace('-', '');
        const value = control.children[1].valueAsNumber;
        if(value !== clip[property]) {
            clip[property] = value;
        }
    });
    updateTable(videos, weights);
}

function updateClipDialog(clip) {
    currentId = clip.id;
    clipDialog.querySelector('h2').textContent = clip.name;
    const controls = weights.map((weight, index )=> {
        const property = weight.name.toLowerCase().replace(' ', '');
        return { 
            name: property,
            value: clip[property] || 0
        }
    });
    View.updateAttributeControls(controls);
}

function updateTable(clips, weights) {
    const ratings = rate(clips, weights);
    const rows = createRows(ratings);
    table.tBodies[0].replaceChildren(...rows);
}