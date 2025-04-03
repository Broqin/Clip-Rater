export class Attribute {
    constructor(name, value = 0) {
        this.name = name;
        this.value = value;
    }

    reset() {
        this.value = 0;
    }
}