import SettingsComponent from "../component/settings.js";
import VideosComponent from "../component/videos.js";
import WeightsComponent from "../component/weights.js";

export class View2 {

    static settings = SettingsComponent;
    static videos = VideosComponent;
    static weights = WeightsComponent;

    static {
        this.#attachListeners();
    }

    static #attachListeners() {
        window.addEventListener('click', this.#closeDialog);
        window.addEventListener('click', this.#resetSearchControl);
    }

    static #closeDialog(event) {
        const button = event.target.closest('button[name="action"][value="close"]');
        if(!button) return;
        event.target.closest('dialog')?.close();
    }

    static #resetSearchControl(event) {
        const control = event.target.closest('.search.control');
        if(!control) return;
        const input = control.querySelector('input');
        if(!input) return;
        input.value = '';
    }
}