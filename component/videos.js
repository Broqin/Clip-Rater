export default class VideosComponent {

    static section = document.querySelector('#videos');
    static playlists = document.querySelector('#videos select');
    static table = document.querySelector('#videos table');

    static {

    }

    static createPlaylistOptions(playlists) {
        const options = [];
        for(const [id, playlist] of playlists) {
            const option = document.createElement('option');
            option.textContent = playlist.name;
            option.value = id;
            options.push(option);
        }
        this.playlists.replaceChildren(...options);
    }

    static createRows(videos) {
        let position = 1;
        const rows = [];
        for(const [id, video] of videos) {
            const tr = document.createElement('tr');
            const positionCell = document.createElement('td');
            positionCell.textContent = position++;
            const cells = this.createCells(video);
            tr.append(positionCell, ...cells);
            rows.push(tr);
        }
        this.table.tBodies[0].replaceChildren(...rows);
    }

    static createCells(video) {
        const cells = [];
        for(const property in video) {
            const td = document.createElement('td');
            if(property === 'thumbnails') {
                const thumbnail = document.createElement('img');
                thumbnail.classList.add('loading');
                thumbnail.src = video.thumbnails.default.url;
                thumbnail.onload = event => thumbnail.classList.remove('loading');
                td.append(thumbnail);
            } else {
                td.textContent = video[property];
            }
            cells.push(td);
        }
        return [cells[1], cells[0]];
    }

}