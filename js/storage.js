export default class Playlists {

    constructor(storageName) {
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

    getPlaylist(playlistId) {
        return this.playlists.find(playlist => playlist.id === playlistId);
    }
    
    load() {
        return localStorage.getItem(this.storageName);
    }
    
    save() {
        localStorage.setItem(this.storageName, JSON.stringify(this.playlists));
    }
}