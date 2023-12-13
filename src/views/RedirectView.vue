<script setup>
import AlbumListItem from '@/components/AlbumListItem.vue';
import { ref } from 'vue'
console.log('hi');


// logic: if code in storage fetch profile. if fails clear storage.
// else if code in url save. fetch profile
// else redirect to login

const username = ref('')
const userid = ref(null)
const playlists = ref([])
const testdata = ref('')
// "https://api.spotify.com/v1/users/"

const clientId = 'a6aab6549ff545bfa6fdd54a78d19770';
const redirectUri = 'http://localhost:5173/redirect';

const args = new URLSearchParams(window.location.search);
const code = args.get('code');


let currentToken = localStorage.getItem('spotify_access_token');




const getToken = async (code) => {
console.log('gettoken');
// stored in the previous step
let codeVerifier = localStorage.getItem('code_verifier');

const payload = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  }),
}

const body = await fetch('https://accounts.spotify.com/api/token', payload);
const response = await body.json();
console.log('respones.access_token:',response.access_token);
localStorage.setItem('spotify_access_token', response.access_token);
return response.access_token
}

async function fetchProfile() {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${currentToken}` }
    });

    // TODO
    // if error clear storage and ?reload page?
    return await result.json();

    
}

async function fetchPlaylists() {
  const result = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
        method: "GET", headers: { Authorization: `Bearer ${currentToken}` }
    });
  
    console.log('playlists fetched');
  return await result.json();
}

async function loadPageData() {
  const profile = await fetchProfile(currentToken);
  username.value = profile.display_name
  userid.value = profile.id
  const playlistsdata = await fetchPlaylists()
  console.log(playlistsdata);
  playlists.value = playlistsdata.items

  testdata.value = 'yeah'
}


if (currentToken) {

  console.log('in storage', currentToken );
  await loadPageData()
} else if (code) {
  console.log('in url', code );
  const spotifyAccessToken = await getToken(code)
  // localStorage.getItem('spotify_access_token', code)
  await loadPageData()
} else {
  console.log('no token, logging in');
  await generateSpotifyToken();
  console.log('finished generating');
  // reloads page causing above code to run.
}

async function generateSpotifyToken() {
    
    const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  }

  const codeVerifier  = generateRandomString(64);

  const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }

  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed);
  // generated in the previous step
  window.localStorage.setItem('code_verifier', codeVerifier);

  const scope = 'user-read-private user-read-email playlist-read-collaborative playlist-read-private';
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  
  const params =  {
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  }

  authUrl.search = new URLSearchParams(params).toString();
  window.location.href = authUrl.toString();

}


</script>

<template>
  <h1>HELLO {{ username }}</h1>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); grid-gap: 1rem;">
  <AlbumListItem v-for="playlist in playlists" :playlist="playlist"  />
  </div>
  
</template>
