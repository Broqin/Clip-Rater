export default class WeightsComponent {
    static button = document.querySelector('#weights button');
    static controls = document.querySelector('#weights ul');
    static form = document.querySelector('#weights');
    static input = document.querySelector('#weight');

    static {
        this.button.addEventListener('click', this.toggleWeights.bind(this));
    }

    static createControls(weights) {
        const controls = [];
        for(const [name, value] of weights) {
            const input = document.createElement('input');
            const label = document.createElement('label');
            const li = document.createElement('li');
            const output = document.createElement('output');
            const slug = name.toLowerCase().replace(/\s+/g, '');
            input.id = slug;
            input.max = 10;
            input.min = -10;
            input.type = 'range';
            input.value = value;
            label.textContent = name;
            label.setAttribute('for', slug);
            output.setAttribute('for', slug);
            output.textContent = value;
            li.append(label, input, output);
            li.classList.add('control');
            controls.push(li);
        }
        this.controls.replaceChildren(...controls);
    }

    static setControls(weights = []) {
        console.log(weights)
        const controls = this.weightControls.children;
        for(const weight of weights) {
            for(const control of controls) {
                const label = control.children[0];
                const input = control.children[1];
                const output = control.children[2];
                    if(label.textContent === weight.name) {
                    input.value = weight.value;
                    output.textContent = weight.value;
                }
            }
        }
    }

    static toggleWeights(event) {
        const isClosed = this.button.value === 'close';
        this.button.value = isClosed ? 'open' : 'close';
        this.form.classList.toggle('hidden', isClosed);
    }
}