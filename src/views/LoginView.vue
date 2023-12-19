<script setup>
import { getToken } from '@/helpers/apifunctions';
import { useRouter } from 'vue-router';

const args = new URLSearchParams(window.location.search);
const code = args.get('code');

if (code) {
  await getToken(code)
  useRouter().push('/home')
}

const clientId =  import.meta.env.VITE_SPOTIFY_CLIENT_ID; // env var 
const redirectUri = window.location.origin + import.meta.env.VITE_SPOTIFY_REDIRECT_URL; //env var

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

  const scope = 'user-read-private user-read-email playlist-read-collaborative playlist-read-private user-modify-playback-state app-remote-control streaming user-modify-playback-state';
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
  <main>
      <button @click="generateSpotifyToken">Login With Spotify</button>
    </main>
</template>
