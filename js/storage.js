export default class Playlists {

    constructor(storageName) {
        this.storageName = storageName;
        this.storage = localStorage.getItem(this.storageName);
        this.playlists = this.storage ? JSON.parse(this.storage) : [];
    }

    addPlaylist(playlist) {
        this.playlists.push(playlist);
    }

    isPlaylist(playlistId) {
        return this.getPlaylist(playlistId) !== undefined;
    }

    getPlaylist(id) {
        return this.playlists.find(playlist => playlist.id === id);
    }
    
    load() {
        return localStorage.getItem(this.storageName);
    }
    
    save() {
        localStorage.setItem(this.storageName, JSON.stringify(this.playlists));
    }
}