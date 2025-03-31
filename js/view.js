export class View {
    static attributesForm = document.querySelector('#attributes');
    static attributesList = this.attributesForm.querySelector('ul');
    static clipDialog = document.querySelector('#clip');
    static playlistsButton = document.querySelector('#playlists-button');
    static playlistsDialog = document.querySelector('#playlists');
    static playlistsList = this.playlistsDialog.querySelector('ul');
    static rankingsTable = document.querySelector('#rankings');
    static weightsForm = document.querySelector('#weights');
    static weightsButton = this.weightsForm.querySelector('header button');
    static weightsInput = this.weightsForm.querySelector('#weight');
    static weightsList = this.weightsForm.querySelector('ul');

    static {
        this.playlistsButton.addEventListener('click', this.togglePlaylists.bind(this));
        this.weightsButton.addEventListener('click', this.toggleWeights.bind(this));
    }

    // { name: example, value: 0 }
    static createAttributes(attributes = {}) {
        const list = [];
        for(const property in attributes) {
            const value = attributes[property];
            //console.log(property, value)
            if(value < 1) continue;
            const item = document.createElement('li');
            item.textContent = `${property}: ${value}`; 
            list.push(item);
        }
        return list;
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

    static togglePlaylists() {
        const closed = this.weightsButton.value === 'close';
        this.playlistsButton.value = closed ? 'open' : 'close';
        if(closed) {
            this.playlistsDialog.showModal();
        } else {
            this.playlistsDialog.close();
        }
    }

    static toggleWeights(event) {
        const condition = this.weightsButton.value === 'close';
        this.weightsButton.value = condition ? 'open' : 'close';
        this.weightsForm.classList.toggle('hidden', condition);
    }

    static updateAttributeControls(weights) {
        //console.log(weights)
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

    static updateRankingRows(data) {
        //console.log(data);
        const rows = [...this.rankingsTable.tBodies[0].children];
        rows.forEach((row, index) => {
            const attributes = this.createAttributes(data[index].attributes);
            const image = row.querySelector('img');
            const list = row.querySelector('ul');
            const name = row.children[2].children[0];
            const rank = row.children[0];
            const score = row.children[4];
            image.src = data[index]?.thumbnail;
            name.href = `?video=${data[index].id}`;
            name.textContent = data[index].name;
            rank.textContent = index + 1;
            score.textContent = data[index].score;
            list.append(...attributes);
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