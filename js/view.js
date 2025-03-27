export class View {
    static playlistsButton = document.querySelector('#playlists-button');
    static playlistsDialog = document.querySelector('#playlists');
    static playlistsSelection = this.playlistsDialog.querySelector('ul');

    static {
        this.playlistsButton.addEventListener('click', event => this.playlistsDialog.showModal());
    }

    static createPlaylistsOptions(count) {
        const options = [];
        for(let i = 0; i < count; i++) {
            const button = document.createElement('button');
            const li = document.createElement('li');
            button.name = 'playlist';
            li.append(button);
            options.push(li);
        }
        this.playlistsSelection.replaceChildren(...options);
    }

    static getPlaylistsOptions() {
        return [...this.playlistsSelection.children];
    }

    static setPlaylistsOptions(playlists) {
        const options = this.getPlaylistsOptions();
        options.forEach((option, index) => {
            const button = option.children[0];
            const playlist = playlists[index];
            button.textContent = playlist.name;
            button.value = playlist.id;
        });
    }

}