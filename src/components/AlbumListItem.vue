<script setup>
defineProps({
  playlist: {
    type: Object,
    required: true
  }
})
</script>

<template>
    <div style="
  display: flex; flex-direction: column; padding-bottom: 10px;
  justify-content: center; /* Centers horizontally */
  align-items: center; text-align: center;">
        <img :src="playlist.images[0].url" width="100" style="margin: 10px;"/>
        <p>{{ playlist.name }}</p>

    </div>

</template>

<style scoped>
</style>


