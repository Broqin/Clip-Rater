import PlaylistsComponent from "../component/playlists.js";
import WeightsComponent from "../component/weights.js";

export class View2 {

    static playlists = PlaylistsComponent;
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

    static createRankingRows(rankings = []) {
        const rows = [];
        for(let i = 0; i < count; i++) {
            const tr = document.createElement('tr');
            const cells = this.createRankingCells();
            tr.append(...cells);
            rows.push(tr);
        }
        return rows;
    }
}