import { getPlaylist, getPlaylistItems }  from "./playlist.js";
import { Playlist } from "../models/playlist.js";
import Playlists from "./storage.js";
import { View } from "./view.js";

/* ELEMENTS */
const clipDialog = document.querySelector('#clip');
const clipDialogForm = clipDialog.querySelector('form');
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
let clips = [];
let playlist = null;
let currentId;
let player;

window.onYouTubeIframeAPIReady = () => {
    //console.log('API READY')
    try {
        player = new YT.Player('player', {
            playerVars: {
                autoplay: 0
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    } catch (error) {
        console.log('YouTube Iframe API Error', error);
    }
}

function attachEventListeners() {
    clipDialog.addEventListener('close', handleClipDialog)
    clipDialogForm.addEventListener('submit', handleClipDialog);
    View.playlistsDialog.addEventListener('click', handleSelectPlaylist);
    View.playlistsDialog.addEventListener('submit', handleAddPlaylist);
    View.rankingsTable.addEventListener('touchend', handleTableClick);
    View.rankingsTable.addEventListener('click', handleTableClick);
    View.weightsForm.addEventListener('change', handleWeightChange);
    View.weightsForm.addEventListener('input', handleWeightsRanges);
    View.weightsForm.addEventListener('submit', handleWeightsSubmit);
    View.weightsInput.addEventListener('keyup', handleWeightsSearch);
    window.addEventListener('click', handleButtons);
}

function createClips(videos) {
    return videos.map(video => {
    // create shallow copy of video
        const clip = {...video};
        clip.attributes = {};
        // apply attributes based on weights
        weights.forEach(weight => {
            // remove spaces from weight name to use as attribute
            const property = weight.name.toLowerCase().replace(' ', '');
            // set attribute
            clip.attributes[property] = 0;
        });
        return clip;
    });
}

async function createPlaylist(id) {
    if(!playlists.isPlaylist(id)) {
        const videos = await getPlaylistItems(id).then(data => data.items.map(item => ({
            id: item.snippet.resourceId.videoId,
            name: item.snippet.title,
            position: item.snippet.position,
            thumbnails: item.snippet.thumbnails
        })));
        const name = await getPlaylist(id).then(data => data.items[0].snippet.title);
        const playlist = new Playlist(id, name, videos);
        playlists.addPlaylist(playlist);
        playlists.save();
    }
}

function createStorages() {
    const storageNames = ['playlists', 'scores', 'weights'];
    try {
        for(const storageName of storageNames) {
            localStorage.setItem(storageName, '[]');
        }
    } catch(error) {
        console.error('Error creating storages.');
    }
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
    if(!playlist) return;
    const tr = event.target.closest('tbody tr');
    if(!tr) return;
    const name = tr.children[2].textContent;
    const video = playlist.videos.find(video => video.name === name);
    if(!video) return;
    player.playVideoAt(video.position);
    clipDialog.showModal();
}

function handleWeightChange(event) {
    const name = event.target.id.replace('-', '');
    const weight = weights.find(weight => weight.name.toLowerCase().replace(' ', '') === name);
    if(!weight) return;
    weight.value = event.target.valueAsNumber;
}

function handleWeightsRanges(event) {
    if(event.target.type !== 'range') return;
    event.target.nextElementSibling.textContent = event.target.value;
}

function handleWeightsSearch(event) {
    console.log(event.target.value);
    const controls = [...View.weightsList.children].forEach(control => {
        const condition = control.children[0].textContent.toLowerCase().includes(event.target.value.toLowerCase());
        control.classList.toggle('hidden', !condition);
    });
}

function handleWeightsSubmit(event) {
    event.preventDefault();
    updateTable(clips, weights);
}

async function initialize() {
    //console.log('initializing');
    // initialize view
    if(sessionStorage.playlist && sessionStorage.clips) {
        playlist = JSON.parse(sessionStorage.playlist);
        clips = JSON.parse(sessionStorage.clips);
        player.cuePlaylist({ listType: 'playlist', list: playlist.id });
        updateTable(clips, weights);
    }
    View.createPlaylistsOptions(playlists.playlists.length);
    View.setPlaylistsOptions(playlists.playlists);
    View.playlistsButton.disabled = false;
    View.updateWeightsList(weights);
    View.createAttributesControls(weights.length);
    View.updateAttributeControls(weights.map(weight => ({ name: weight.name, value: 0 })));
    // attach event listeners
    attachEventListeners();
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
        const clip = clips.find(video => video.name === name);
        if(clip) {
            updateClipDialog(clip);
        }
    }
}

function rate(clips, weights) {
    return clips.map(clip => {

        let score = 0;

        weights.forEach(weight => {
            const clipValue = clip.attributes[weight.name.toLowerCase().replace(' ', '')]; // Match the property name
            if (clipValue !== undefined) {
                score += clipValue * weight.value;
            }
        })

        clip.score = score;

        return clip;

    }).sort((a, b) => b.score - a.score);
}

function setPlaylist(id) {
    //console.log('setting playlist id', id)
    const { name, videos } = playlists.getPlaylist(id);
    if(!name || !videos ) return console.error('Playlist does not exist in storage.');
    playlist = new Playlist(id, name, videos);
    player.stopVideo();
    player.cuePlaylist({ listType: 'playlist', list: id });
    clips = createClips(playlist.videos);
    updateTable(clips, weights);

    sessionStorage.setItem('clips', JSON.stringify(clips));
    sessionStorage.setItem('playlist', JSON.stringify(playlist));
}

function updateClip(id) {
    const clip = clips.find(clip => clip.id === id);
    if(!clip) return;
    const controls = clipDialogForm.querySelectorAll('.control');
    controls.forEach(control => {
        const property = control.children[1].id.replace('-', '');
        const value = control.children[1].valueAsNumber;
        clip.attributes[property] = value;
    });
    updateTable(clips, weights);
}

function updateClipDialog(clip) {
    if(clip.id === currentId) return;
    currentId = clip.id;
    clipDialog.querySelector('h2').textContent = clip.name;
    const controls = weights.map((weight, index )=> {
        const property = weight.name.toLowerCase().replace(' ', '');
        return { 
            name: property,
            value: clip.attributes[property] || 0
        }
    });
    View.updateAttributeControls(controls);
}

function updateTable(clips, weights) {
    const ratings = rate(clips, weights);
    const data = ratings.map(item => {
        return {
            id: item.id,
            attributes: item.attributes,
            medal: medals[item.medal],
            name: item.name,
            score: item.score,
            thumbnail: item.thumbnails.default.url
        }
    });
    const rows = View.createRankingRows(data.length);
    View.rankingsTable.tBodies[0].replaceChildren(...rows);
    View.updateRankingRows(data);
}

window.addEventListener('keyup', event => {
    if(event.key === 'Tab') {
        console.log(document.activeElement)
    }
})