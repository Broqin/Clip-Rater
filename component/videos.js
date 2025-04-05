export default class VideosComponent {

    static section = document.querySelector('#videos');
    static table = document.querySelector('#videos table');
    static toggleButton = document.querySelector('#videos button[value="close"]');

    static {
        this.toggleButton.addEventListener('click', this.toggle.bind(this));
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

    static toggle(event) {
        const isClosed = this.toggleButton.value === 'close';
        this.toggleButton.value = isClosed ? 'open' : 'close';
        this.section.classList.toggle('hidden', isClosed);
    }

}