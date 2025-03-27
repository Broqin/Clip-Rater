export default class Playlists {

    constructor(storageName) {
        this.currentPlaylist = undefined;
        this.currentVideo = 0;
        this.storageName = storageName;
        this.storage = localStorage.getItem(this.storageName);
        this.playlists = this.storage ? JSON.parse(this.storage) : [];
    }

    addPlaylist(id, name, videos) {
        const playlist = {
            id: id,
            name: name,
            videos: videos
        };
        this.playlists.push(playlist);
    }

    isPlaylist(playlistId) {
        return this.getPlaylist(playlistId) !== undefined;
    }

    getCurrentPlaylist() {
        if(!this.currentPlaylist) return console.error('No current playlist has been set.');
        return this.currentPlaylist;
    }

    getPlaylist(id) {
        return this.playlists.find(playlist => playlist.id === id);
    }

    /**
     * Sets the current playlist.
     * @param {String} id - Youtube playlist id.
     */
    setPlaylist(id) {
        const playlist = this.getPlaylist(id);
        if(!playlist) return console.error('Can not set a playlist that does not exist in storage!');
        this.currentPlaylist = playlist;
        return playlist;
    }
    
    load() {
        return localStorage.getItem(this.storageName);
    }
    
    save() {
        localStorage.setItem(this.storageName, JSON.stringify(this.playlists));
    }
}