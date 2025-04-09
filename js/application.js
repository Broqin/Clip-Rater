import { Attribute } from "../models/attribute.js";
import { Playlist } from "../models/playlist.js";
import  { View2 as View } from "./view2.js";

class Application {

    static playlist = null;
    static playlistsCollection = null; // [{ name: 'example', videos: [] }, ...]
    static video = null;
    static weightsCollection = null; // [{ name: 'example', value: 0 }, ...]
    static weights = null;

    static {
        // get collections
        this.loadPlaylistsCollection();
        this.loadWeightsCollection();

        const playlist = sessionStorage.getItem('playlist');
        if(playlist) {
            this.playlist = this.playlistsCollection.get(playlist);
            View.videos.createRows(this.playlist.videos);
        }

        const weights = sessionStorage.getItem('weights');
        if(weights) {
            this.weights = this.weightsCollection.get(weights);
            View.weights.createControls(this.weights.entries());
        }

        // present playlists options
        View.settings.createOptions(this.playlistsCollection.entries());
        View.settings.createWeights(this.weightsCollection.entries());
        View.settings.button.disabled = false;
        View.videos.createPlaylistOptions(this.playlistsCollection.entries());
        View.weights.createOptions(this.weightsCollection.entries());
        View.videos.playlists.addEventListener('change', this.setPlaylist.bind(this));
        View.weights.select.addEventListener('change', this.setWeights.bind (this));
        window.addEventListener('keyup', event => {
            if(event.key === 'Tab') {
                console.log('focused element', document.activeElement)
            }
        })
    }

    static isValidWeightsCollection(collection) {
        try {
            if(!Array.isArray(collection)) {
                throw new Error('Collection must be an array.');
            }

            collection.forEach((item, index) => {
                if(typeof item !== 'object') {
                    throw new Error(`Item at index ${index} must be an object.`);
                }

                if(typeof item.name !== 'string') {
                    throw new Error(`Item at index ${index} must have a 'name' property with a string for a value.`);
                }

                if(!Array.isArray(item.weights)) {
                    throw new Error(`Item at index ${index} must have a 'weights' property with an array for a value.`);
                }

                item.weights.forEach((item, index) => {

                    if(typeof item.name !== 'string') {
                        throw new Error(`Item at index ${index} in 'weights' must have a 'name' property with a string for a value.`);
                    }

                    if(typeof item.value !== 'number') {
                        throw new Error(`Item at index ${index} in 'weights' must have a 'value' property with a number for a value.`);
                    }

                });
            });
            return true;
        } catch(error) {
            console.error('Error validating weights collection.', error.message);
        }
    }

    static loadPlaylistsCollection() {
        try {
            const storage = localStorage.getItem('playlists')
            if(!storage) {
                throw new Error('No playlists found in local storage.');
            }

            const data = JSON.parse(storage);
            if(!data) {
                throw new Error('Could not parse playlists from local storage.');
            }

            this.playlistsCollection = new Map();

            for(const item of data) {

                const videos = new Map();

                for(const video of item.videos) {
                    videos.set(video.id, {
                        name: video.name,
                        thumbnails: video.thumbnails
                    });
                }

                const playlist = {
                    name: item.name,
                    videos: videos
                }

                this.playlistsCollection.set(item.id, playlist);
            }
        } catch(error) {

        }
    }

    // [{ name: 'example', weights: [] }, ...]
    static loadWeightsCollection() {
        try {
            const storage = localStorage.getItem('weights');
            if(!storage) {
                throw new Error(`No 'weights' in local storage.`);
            }

            const data = JSON.parse(storage);
            if(!data) {
                throw new Error(`Could not parse 'weights' from local storage.`);
            }

            if(!this.isValidWeightsCollection(data)) {
                throw new Error(`Invalid 'weights' collection.`)
            };

            this.weightsCollection = new Map(data.map(collection => [collection.name, new Map(collection.weights.map(weight => [weight.name, weight.value]))]));
        } catch (error) {
            console.error('Error loading weights collection.', error.message);
        }
    }

    static setPlaylist(event) {
        this.playlist = this.playlistsCollection.get(event.target.value);
        sessionStorage.setItem('playlist', event.target.value);
        View.videos.createRows(this.playlist.videos);
    }

    static setWeights(event) {
        this.weights = this.weightsCollection.get(event.target.value);
        sessionStorage.setItem('weights', event.target.value);
        View.weights.createControls(this.weights.entries());
    }

}