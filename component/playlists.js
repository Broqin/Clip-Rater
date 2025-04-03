export default class PlaylistsComponent {
    static button = document.querySelector('#playlists-button');
    static dialog = document.querySelector('#playlists');
    static list = document.querySelector('#playlists ul');
    static toggleButton = document.querySelector('#playlists button[name="toggle"]');

    static {
        this.button.addEventListener('click', event => this.dialog.showModal());
        this.toggleButton.addEventListener('click', this.toggleOptions.bind(this));
        console.log(this.toggleButton)
    }

    static createOptions(playlists) {
        const options = [];
        for(const [id, playlist] of playlists) {
            const button = document.createElement('button');
            const li = document.createElement('li');
            button.name = 'playlist';
            button.textContent = playlist.name;
            button.value = id;
            li.append(button);
            options.push(li);
        }
        this.list.replaceChildren(...options);
    }

    static toggleOptions(event) {
        const isClosed = this.toggleButton.value === 'close';
        this.toggleButton.value = isClosed ? 'open' : 'close';
        this.list.classList.toggle('hidden', isClosed);
    }

}