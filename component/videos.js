export default class VideosComponent {

    static section = document.querySelector('#videos');
    static table = document.querySelector('#videos table');
    static toggleButton = document.querySelector('#videos button[value="close"]');

    static {
        this.toggleButton.addEventListener('click', this.toggle.bind(this));
    }

    // { id: 0, name: 'x', }
    static createRankingCells(video) {
        const cells = [];
        for(let i = 0; i < 5; i++) {
            const cell = document.createElement('td');
            switch(i) {
                case 1:
                    const image = document.createElement('img');
                    image.classList.add('loading');
                    image.height = 90;
                    image.onload = event => image.classList.remove('loading');
                    image.width = 120;
                    cell.append(image);
                    break;
                case 2:
                    const anchor = document.createElement('a');
                    cell.append(anchor);
                    break;
                case 3:
                    const list = document.createElement('ul');
                    list.classList.add('pills');
                    cell.append(list);
                    break;
            }  
            cells.push(cell);
        }
        return cells;
    }

    static createRankingRows(count) {
        const rows = [];
        for(let i = 0; i < count; i++) {
            const tr = document.createElement('tr');
            const cells = this.createRankingCells();
            tr.append(...cells);
            rows.push(tr);
        }
        return rows;
    }

    static toggle(event) {
        const isClosed = this.toggleButton.value === 'close';
        this.toggleButton.value = isClosed ? 'open' : 'close';
        this.section.classList.toggle('hidden', isClosed);
    }

}