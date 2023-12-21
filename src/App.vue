<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {logout } from './helpers/authfunctions.js'

const route = useRoute();

</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <p style="position: absolute;top:10px; left: 10px">Spotify Client</p> -->
      <nav v-if="!(route.meta?.hideNavbar)" style="text-align: end;">
        <RouterLink to="/">Home</RouterLink>
        <!-- hide if on login page... -->
        <button @click="logout()">logout</button> 
      </nav>
    </div>
  </header>
<Suspense>
  <RouterView />

</Suspense>
</template>

<style scoped>
header {
  /* line-height: 1.5; */
  /* max-height: 100vh; */
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  /* margin-top: 2rem; */
}

button {
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

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    /* padding: 1rem 0; */
    /* margin-top: 1rem; */
  }
}

</style>
