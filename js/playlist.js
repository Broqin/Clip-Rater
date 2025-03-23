const KEY = 'AIzaSyCXwJLV9e3TLe81VbFVdjk0zYTBeFFXO-E';

export default async function getPlaylistData(playlistId) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching playlist:', error);
    }

    return [];
}