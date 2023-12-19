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
  <main>
    <p style="position: absolute;top:10px;right:10px">HELLO {{ username }}</p>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-gap: 1rem;">
      <AlbumListItem v-for="playlist in playlists" :playlist="playlist" :play="spotifyPlay" @click="handlePlaylistClick(playlist.uri)" />
   </div>
  </main>
</template>
