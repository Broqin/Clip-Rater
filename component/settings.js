export default class SettingsComponent {
    static button = document.querySelector('#playlists-button');
    static dialog = document.querySelector('#settings');
    static input = document.querySelector('#playlists');
    static inputResetButton = document.querySelector('#playlists ~ button[value="reset"]');
    static menu = document.querySelector('#settings menu');
    static playlistsSection = document.querySelector('#playlists-manager');
    static selectedSection = this.playlistsSection;
    static table = document.querySelector('#playlists-manager > table');
    static weightsInput = document.querySelector('#weights-manager input')
    static weightsTable = document.querySelector('#weights-manager > table');

    static {
        this.button.addEventListener('click', event => this.dialog.showModal());
        this.input.addEventListener('keyup', this.searchPlaylists.bind(this));
        this.inputResetButton.addEventListener('click', this.resetSearch.bind(this));
        this.menu.addEventListener('click', this.switchSection.bind(this));
        this.weightsInput.addEventListener('keyup', this.searchWeights.bind(this));
    }

    static createOptions(playlists) {
        const rows = [];
        for(const [id, playlist] of playlists) {
            // create elements
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            const nameCell = document.createElement('td');
            const refreshButton = document.createElement('button');
            const row = document.createElement('tr');
            // update attributes
            deleteButton.classList.add('delete' ,'icon');
            deleteButton.textContent = 'Delete';
            nameCell.textContent = playlist.name;
            refreshButton.classList.add('sync', 'icon');
            refreshButton.textContent = 'Refresh';
            // compose elements
            actionsCell.append(refreshButton, deleteButton);
            row.append(nameCell, actionsCell);
            // push element into array
            rows.push(row);
        }
        this.table.tBodies[0].replaceChildren(...rows);
    }

    static createWeights(weights) {
        const rows = [];
        for(const [id, weight] of weights) {
            // create elements
            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            const nameCell = document.createElement('td');
            const row = document.createElement('tr');
            // update attributes
            deleteButton.classList.add('delete' ,'icon');
            deleteButton.textContent = 'Delete';
            nameCell.textContent = id;
            // compose elements
            actionsCell.append(deleteButton);
            row.append(nameCell, actionsCell);
            // push element into array
            rows.push(row);
        }
        this.weightsTable.tBodies[0].replaceChildren(...rows);
    }

    static searchPlaylists(event) {
        const value = event ? event.target.value.toLowerCase() : '';
        [...this.table.tBodies[0].children].forEach(row => {
            const isValid = row.cells[0].textContent.toLowerCase().includes(value);
            row.classList.toggle('hidden', !isValid);
        });
    }

    static searchWeights(event) {
        const value = event.target.value;
        const rows = [...this.weightsTable.tBodies[0].children];
        if(!rows) return;
        rows.forEach(row => {
            const isMatch = row.cells[0].textContent.toLowerCase().includes(value);
            row.classList.toggle('hidden', !isMatch);
        })
    }

    static switchSection(event) {
        const button = event.target.closest('menu button');
        if(!button) return;
        const section = document.querySelector(`#${button.value}-manager`);
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