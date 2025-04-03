export default class PlaylistsComponent {
    static button = document.querySelector('#playlists-button');
    static dialog = document.querySelector('#playlists');
    static input = document.querySelector('#playlists input');
    static table = document.querySelector('#playlists table');

    static {
        this.button.addEventListener('click', event => this.dialog.showModal());
        this.input.addEventListener('keyup', this.searchPlaylists.bind(this));
    }

    static createOptions(playlists) {
        const rows = [];
        for(const [id, playlist] of playlists) {
            // create elements
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            const nameAnchor = document.createElement('a');
            const nameCell = document.createElement('td');
            const refreshButton = document.createElement('button');
            const row = document.createElement('tr');
            // update attributes
            deleteButton.classList.add('delete' ,'icon');
            deleteButton.textContent = 'Delete';
            nameAnchor.href = '?playlist=' + id;
            nameAnchor.textContent = playlist.name;
            refreshButton.classList.add('sync', 'icon');
            refreshButton.textContent = 'Refresh';
            // compose elements
            actionsCell.append(refreshButton, deleteButton);
            nameCell.append(nameAnchor);
            row.append(nameCell, actionsCell);
            // push element into array
            rows.push(row);
        }
        this.table.tBodies[0].replaceChildren(...rows);
    }

    static searchPlaylists(event) {
        [...this.table.tBodies[0].children].forEach(row => {
            console.log(row)
            const isValid = row.cells[0].children[0].textContent.toLowerCase().includes(event.target.value.toLowerCase());
            row.classList.toggle('hidden', !isValid);
        });
    }

}