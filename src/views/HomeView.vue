<script setup>
import AlbumListItem from '@/components/AlbumListItem.vue';
import { fetchPlaylists, fetchProfile, playPlaylist, pausePlayback, switchPlaybackToLocalDevice } from '@/helpers/apifunctions';
import { embedplaybacksdk } from '@/helpers/playback';
import { ref } from 'vue';


const username = ref('')
const userid = ref(null)
const playlists = ref([])
const spotifyPlayer = ref(null)
const isPlaying = ref(false)
let currentToken = localStorage.getItem('spotify_access_token');


await loadPageData()

async function loadPageData() {
  const profile = await fetchProfile(currentToken);
  username.value = profile.display_name
  userid.value = profile.id
  const playlistsdata = await fetchPlaylists()
  playlists.value = playlistsdata.items
}

embedplaybacksdk()
window.onSpotifyWebPlaybackSDKReady = () => {
  const token = localStorage.getItem("spotify_access_token");
  spotifyPlayer.value = new Spotify.Player({
    name: "Web Playback SDK Quick Start Player",
    getOAuthToken: (cb) => {
      cb(token);
    },
    volume: 0.5,
  });

  //   app.config.globalProperties.$spotifyPlayer = player;
  localStorage.setItem("spotify-player", JSON.stringify("player"));
  // Ready
  spotifyPlayer.value.addListener("ready", ({ device_id }) => {
    localStorage.setItem('device_id',device_id);
  });

  // Not Ready
  spotifyPlayer.value.addListener("not_ready", ({ device_id }) => {
    console.log("Device ID has gone offline", device_id);
  });

  spotifyPlayer.value.addListener("initialization_error", ({ message }) => {
    console.error(message);
  });

  spotifyPlayer.value.addListener("authentication_error", ({ message }) => {
    console.error(message);
  });

  spotifyPlayer.value.addListener("account_error", ({ message }) => {
    console.error(message);
  });

  //document.getElementById("togglePlay").onclick = function () {
    //console.log("toggleplay", spotifyPlayer.value);
    // spotifyPlayer.value.togglePlay();
  //};

  spotifyPlayer.value.connect();
  spotifyPlayer.value.setName("Mushkies Web Client");
  switchPlaybackToLocalDevice(localStorage.getItem('device_id'))
};
const spotifyPlay = (playlistUri) => { 
  playPlaylist(playlistUri)
  isPlaying.value=playlistUri
}
const pause = () => {
  pausePlayback()
  .catch((err)=>{
    console.log('could not pause', err)
  }).finally(()=> {
    isPlaying.value=false
  })
}

const handlePlaylistClick = (playlistUri) => {
  console.log('handleplaylistclick',playlistUri,isPlaying.value);
  isPlaying.value && isPlaying.value==playlistUri ? pause() : spotifyPlay(playlistUri)
}

</script>

<template>
  <main class="main">
    <p style="position: absolute;top:40px;left:40px; color: #1DB954;">Hello {{ username }}</p>
    <div v-show="showTrackList" class="track-list-container">
      <div>
      <button @click="trackListMinify = !trackListMinify" style="float: left;">{{trackListMinify ? 'show' : 'hide'}}</button>
      <div v-show="!trackListMinify" style="margin-left:100px" >
        <button @click="changePage(-1)" :disabled="currentPage.value <= 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(1)" :disabled="currentPage.value >= totalPages">Next</button>
      </div>

      </div>
      <div v-show="!trackListMinify" v-for="track in showTrackList" class="track-item">{{ track }}</div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-gap: 1rem;">
      <AlbumListItem v-for="playlist in playlists" :playlist="playlist" :play="spotifyPlay" @click="handlePlaylistClick(playlist.uri)" />
   </div>
  </main>
</template>

<style scoped>
.track-list-container {
  /* background: grey; */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px;
  font-family: 'Arial', sans-serif;

}

.track-list-container button {
  background-color: #1DB954; /* Spotify green */
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 5px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.track-list-container button:hover {
  background-color: #1ED760; /* Lighter green for hover state */
}

.track-list-container button:disabled {
  background-color: #cccccc; /* Grey out the button when disabled */
  cursor: not-allowed;
}

.track-list-container span {
  font-size: 0.9rem;
  color: #1DB954;
  margin: 0 10px;
}

.track-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 0;
  color: #1DB954
}

.track-item:last-child {
  border-bottom: none;
}

.track-item:before {
  content: '♪ '; /* Adds a musical note before each track */
  color: #1DB954;
  font-size: 1.2rem;
}

</style>