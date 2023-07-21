const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Sample data - Replace this with your database or use an array as a temporary storage
let playlists = [
  {
    id: 'playlist-1',
    name: 'My Awesome Playlist',
    songs: [
      { id: 'song-1', title: 'Song Title 1', artist: 'Artist 1', playCount: 5 },
      { id: 'song-2', title: 'Song Title 2', artist: 'Artist 2', playCount: 10 },
      { id: 'song-3', title: 'Song Title 3', artist: 'Artist 3', playCount: 2 },
    ],
  },
  {
    id: 'playlist-2',
    name: 'Chill Out Vibes',
    songs: [
      { id: 'song-4', title: 'Song Title 4', artist: 'Artist 4', playCount: 3 },
      { id: 'song-5', title: 'Song Title 5', artist: 'Artist 5', playCount: 8 },
      { id: 'song-6', title: 'Song Title 6', artist: 'Artist 6', playCount: 12 },
    ],
  },
];

// Define the Playlist model
class Playlist {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.songs = [];
  }
}

// Define the Song model
class Song {
  constructor(id, title, artist) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.playCount = 0; // Initialize play count to 0
  }
}

// Create a new playlist
app.post('/playlists', (req, res) => {
  const { id, name } = req.body;
  const newPlaylist = new Playlist(id, name);
  playlists.push(newPlaylist);
  res.status(201).json(newPlaylist);
});

// Add a song to a playlist
app.post('/playlists/:id/songs', (req, res) => {
  const playlistId = req.params.id;
  const { id, title, artist } = req.body;

  const playlist = playlists.find((playlist) => playlist.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }

  const newSong = new Song(id, title, artist);
  playlist.songs.push(newSong);
  res.status(201).json(newSong);
});

// Increment play count of a song
app.put('/playlists/:playlistId/songs/:songId/play', (req, res) => {
  const { playlistId, songId } = req.params;
  const playlist = playlists.find((playlist) => playlist.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }

  const song = playlist.songs.find((song) => song.id === songId);
  if (!song) {
    return res.status(404).json({ message: 'Song not found in the playlist' });
  }

  song.playCount++;
  res.json(song);
});

// Get list of songs sorted by most played
app.get('/playlists/:id/songs/most-played', (req, res) => {
  const playlistId = req.params.id;
  const playlist = playlists.find((playlist) => playlist.id === playlistId);
  if (!playlist) {
    return res.status(404).json({ message: 'Playlist not found' });
  }

  const sortedSongs = playlist.songs.sort((a, b) => b.playCount - a.playCount);
  res.json(sortedSongs);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
