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
      <!-- <button>Login With Spotify</button> -->
      
    <div class="login-container">
      <div class="login-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="music-image">
          <path fill="#1ed760" d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8Z"/>
          <path d="M406.6 231.1c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3zm-31 76.2c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm-26.9 65.6c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4z"/>
        </svg>
        <h1 class="app-name">Personalized Spotify</h1>
        <button  @click="generateSpotifyToken" class="login-button">Login with Spotify</button>
      </div>
    </div>
  </main>
</template>


<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #C8F9D7;
}

.login-box {
  padding: 20px;
  background: #EDFDF2;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.music-image {
  max-width: 100px;
  margin-bottom: 20px;
}

.app-name {
  margin: 10px 0;
  font-size: 24px;
  color: #333;
}

.login-input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.login-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #45a049;
}
</style>