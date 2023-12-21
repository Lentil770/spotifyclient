<script setup>
import { ref } from 'vue';
import {embedplaybacksdk} from '../helpers/playback.js';

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }, 
  handlePlayClick: {
    type: Function,
    required: true
  },
})
const showplay = ref(false)
const showplaybtn = () => {
  // timeout 2 milliseconds 
  setTimeout(()=>{showplay.value=true},20);
}
const hideplaybtn = () => {
  // timeout 2 milliseconds 
  setTimeout(()=>{showplay.value=false},20);
}
</script>

<template>
    <article style="display: flex; flex-direction: column; padding-bottom: 10px; justify-content: center; /* Centers horizontally */ align-items: center; text-align: center; position: relative;">
        <div v-on:mouseover="showplaybtn()" v-on:mouseleave="hideplaybtn()" @click=""><img id="playlistimg" :src="playlist.images[0].url" width="200px" style="margin: 10px;">
          <p v-show="showplay" style="position: absolute; bottom: 6%; right: 6%; transform: translate(-50%,-50%);" @click.stop="handlePlayClick(playlist.uri, playlist.id)">
            <svg fill="#107e12" height="70px" width="70px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5.4 -5.4 70.80 70.80" xml:space="preserve" stroke="#107e12" stroke-width="6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#a01c1c" stroke-width="7.8"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M45.563,29.174l-22-15c-0.307-0.208-0.703-0.231-1.031-0.058C22.205,14.289,22,14.629,22,15v30 c0,0.371,0.205,0.711,0.533,0.884C22.679,45.962,22.84,46,23,46c0.197,0,0.394-0.059,0.563-0.174l22-15 C45.836,30.64,46,30.331,46,30S45.836,29.36,45.563,29.174z M24,43.107V16.893L43.225,30L24,43.107z"></path> <path d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M30,58C14.561,58,2,45.439,2,30 S14.561,2,30,2s28,12.561,28,28S45.439,58,30,58z"></path> </g> </g></svg>
          </p>
        </div>
        <h4 style="width:200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;color:#1DB954">{{ playlist.name }}</h4>
        
    </article>

</template>

<style scoped>
#playlistimg:hover {
  /* width: 80%; */
  transform: scale(1.02);
  transition: all .3s ease-in-out;
  /* overlay color gray  */
  filter: blur(3px);
}
</style>


