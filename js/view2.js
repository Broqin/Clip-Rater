import PlaylistsComponent from "../component/playlists.js";
import VideosComponent from "../component/videos.js";
import WeightsComponent from "../component/weights.js";

export class View2 {

    static playlists = PlaylistsComponent;
    static videos = VideosComponent;
    static weights = WeightsComponent;

    static {
        this.#attachListeners();
    }

    static #attachListeners() {
        window.addEventListener('click', this.#closeDialog);
    }

    static #closeDialog(event) {
        const button = event.target.closest('button[name="action"][value="close"]');
        if(!button) return;
        event.target.closest('dialog')?.close();
    }
}