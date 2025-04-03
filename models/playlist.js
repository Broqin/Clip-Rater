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
        this.videos = new Map(videos.map(video => [video.id, { name: video.name, thumbnail: video.thumbnail }]));
    }

}