const KEY = 'AIzaSyCXwJLV9e3TLe81VbFVdjk0zYTBeFFXO-E';

export async function getPlaylistItems(playlistId) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if(data.error) return null;

        return data;

    } catch (error) {
        const message = `Error fetching playlist id: ${playlistId}`;
        console.error(message, error);
    }

    return null;
}

export async function getPlaylist(playlistId) {
    const URL = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${KEY}`;

    try {
        const response = await fetch(URL);
        const data = await response.json();

        if(data.error) return null;

        return data;

    } catch (error) {
        const message = `Error fetching playlist id: ${playlistId}`;
        console.error(message, error);
    }

    return null;
}