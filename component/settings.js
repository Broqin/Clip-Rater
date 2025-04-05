export default class SettingsComponent {
    static button = document.querySelector('#playlists-button');
    static dialog = document.querySelector('#settings');
    static input = document.querySelector('#playlists input');
    static inputResetButton = document.querySelector('#playlists input ~ button[value="reset"]');
    static menu = document.querySelector('#settings menu');
    static playlistsSection = document.querySelector('#playlists');
    static selectedSection = this.playlistsSection;
    static table = document.querySelector('#playlists table');

    static {
        this.button.addEventListener('click', event => this.dialog.showModal());
        this.input.addEventListener('keyup', this.searchPlaylists.bind(this));
        this.inputResetButton.addEventListener('click', this.resetSearch.bind(this));
        this.menu.addEventListener('click', this.switchSection.bind(this));
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
            nameAnchor.href = '/?playlist=' + id;
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
        const value = event ? event.target.value.toLowerCase() : '';
        [...this.table.tBodies[0].children].forEach(row => {
            const isValid = row.cells[0].children[0].textContent.toLowerCase().includes(value);
            row.classList.toggle('hidden', !isValid);
        });
    }

    static switchSection(event) {
        const button = event.target.closest('menu button');
        if(!button) return;
        const section = document.querySelector(`#${button.value}`);
        if(!section) return;
        this.dialog.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
        section.classList.remove('hidden');
    }

    static resetSearch() {
        this.input.value = '';
        this.searchPlaylists();
        this.input.focus();
    }

}