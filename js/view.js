export class View {
    static attributesForm = document.querySelector('#attributes');
    static attributesList = this.attributesForm.querySelector('ul');
    static clipDialog = document.querySelector('#clip');
    static playlistsButton = document.querySelector('#playlists-button');
    static playlistsDialog = document.querySelector('#playlists');
    static playlistsList = this.playlistsDialog.querySelector('ul');
    static weightsForm = document.querySelector('#weights');
    static weightsList = this.weightsForm.querySelector('ul');

    static {
        this.playlistsButton.addEventListener('click', event => this.playlistsDialog.showModal());
    }

    static createAttributesControls(count) {
        const controls = [];
        for(let i = 0; i < count; i++) {
            const li = document.createElement('li');
            const input = document.createElement('input');
            const label = document.createElement('label');
            input.min = 0;
            input.placeholder = 0;
            input.setAttribute('value', 0);
            input.type = 'number';
            li.classList.add('control');
            li.append(label, input);
            controls.push(li);
        }
        this.attributesList.replaceChildren(...controls);
    }

    static updateAttributeControls(weights) {
        console.log(weights)
        const controls = [...this.attributesList.children];
        controls.forEach((control, index) => {
            // get elements
            const input = control.children[1];
            const label = control.children[0];
            // create slug
            const name = weights[index].name;
            const slug = name.toLowerCase().replace(' ', '-');
            // update input
            input.id = slug;
            input.name = slug;
            if(name === 'Medal') {
                input.max = 10;
            }
            input.value = weights[index].value;
            // update label
            label.setAttribute('for', slug);
            label.textContent = name;
        });
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
        this.playlistsList.replaceChildren(...options);
    }

    static setPlaylistsOptions(playlists) {
        const options = [...this.playlistsList.children];
        options.forEach((option, index) => {
            const button = option.children[0];
            const playlist = playlists[index];
            button.textContent = playlist.name;
            button.value = playlist.id;
        });
    }

    static updateWeightsList(weights) {
        const items = weights.map(weight => {
            // create dom
            const input = document.createElement('input');
            const label = document.createElement('label');
            const li = document.createElement('li');
            const output = document.createElement('output');
            const slug = weight.name.toLowerCase().replace(' ', '-');
            // update input
            input.id = slug;
            input.max = 10;
            input.min = -10;
            input.type = 'range';
            input.value = weight.value;
            // update label
            label.setAttribute('for', slug);
            label.textContent = weight.name;
            // update output
            output.setAttribute('for', slug);
            output.textContent = weight.value;
            // update li
            li.append(label, input, output);
            li.classList.add('control');
            return li;
        });
        this.weightsList.replaceChildren(...items);
    }

}