<script setup>
import { ref } from 'vue';
import {embedplaybacksdk} from '../helpers/playback.js';

const props = defineProps({
  playlist: {
    type: Object,
    required: true
  }, 
  play: {
    type: Function,
    required: true
  }
})
const showplay = ref(false)
const showplaybtn = () => {
  // timeout 2 milliseconds 
  setTimeout(()=>{showplay.value=true},200);
}
const hideplaybtn = () => {
  // timeout 2 milliseconds 
  setTimeout(()=>{showplay.value=false},20);
}
</script>

<template>
    <article style="display: flex; flex-direction: column; padding-bottom: 10px; justify-content: center; /* Centers horizontally */ align-items: center; text-align: center; position: relative;">
        <div v-on:mouseover="showplaybtn()" v-on:mouseleave="hideplaybtn()" @click="handleAlbumclick()"><img id="playlistimg" :src="playlist.images[0].url" width="200px" style="margin: 10px;">
        <p v-if="showplay" style="position: absolute; top: 40%; left: 50%; transform: translate(-50%,-50%);">play</p></div>
        <h4 style="width:200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ playlist.name }}</h4>
        
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


