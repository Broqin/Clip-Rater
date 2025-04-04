import { Attribute } from "../models/attribute.js";
import { Playlist } from "../models/playlist.js";
import  { View2 as View } from "./view2.js";

class Application {

    static attributes = null;
    static attributesCollection = null; // [{ name: 'example', attributes: [] }, ...]
    static playlist = null;
    static playlistsCollection = null; // [{ name: 'example', videos: [] }, ...]
    static video = null;
    static weightsCollection = null; // [{ name: 'example', value: 0 }, ...]

    static {
        // get collections
        this.loadAttributesCollection();
        this.loadPlaylistsCollection();
        this.loadWeightsCollection();
        // present playlists options
        View.settings.createOptions(this.playlistsCollection.entries());
        View.settings.button.disabled = false;
        // which set from the collection is being used
        this.attributes = this.attributesCollection.get('Example');
        this.playlist = this.playlistsCollection.values().next().value;
        this.weights = this.weightsCollection.get('Example');
        // update view again
        View.weights.createControls(this.weights.entries());
        console.log(this.playlistsCollection, this.playlist)
        //console.log(this.attributes, this.weights);
    }

    static isValidAttributesCollection(collection) {
        try {
            // check if the collection is an array
            if(!Array.isArray(collection)) {
                throw new Error('Collection must be an array.');
            }
            // check if the collection has required properties and types
            collection.forEach((item, index) => {
                if(typeof item !== 'object') {
                    throw new Error(`Item at index ${index} must be an object.`);
                }

                if(typeof item.name !== 'string') {
                    throw new Error(`Item at index ${index} must have a 'name' property with a string for a value.`);
                }

                if(!Array.isArray(item.attributes)) {
                    throw new Error(`Item at index ${index} must have a 'attributes' property with an array for a value.`);
                }

                item.attributes.forEach((item, index) => {
                    if(typeof item !== 'string') {
                        throw new Error(`Item at index ${index} in 'attributes' must be an string.`);
                    }
                });

            });

            return true;
        } catch(error) {
            console.error('Error validationg attributes collection', error.message);
        }
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

    // [{ name: 'example', attributes: [] }, ...]
    static loadAttributesCollection() {
        try {
            const storage = localStorage.getItem('attributes');
            if(!storage) {
                throw new Error(`No 'attributes' in local storage.`);
            }

            const data = JSON.parse(storage);
            if(!data) {
                throw new Error(`Could not parse 'attributes' from local storage.`);
            }

            if(!this.isValidAttributesCollection(data)) {
                throw new Error(`Invalid 'attributes' collection.`)
            };

            this.attributesCollection = new Map(data.map(collection => [collection.name, new Set(collection.attributes)]));
        } catch (error) {
            console.error('Error loading attributes collection.', error.message);
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

}