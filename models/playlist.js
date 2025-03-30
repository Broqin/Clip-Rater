export class Playlist {
    /**
     * 
     * @param {String} id - Youtube playlist id.
     * @param {String} name - Youtube playlist name.
     * @param {Object[]} videos - Array of Youtube videos.
     */
    constructor(id, name, videos) {
        this.id = id;
        this.name = name;
        this.videos = videos;
    }
}