const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID; // env var
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URL; //env var

let currentToken = localStorage.getItem("spotify_access_token");

const getToken = async (code) => {
  // stored in the previous step
  let codeVerifier = localStorage.getItem("code_verifier");

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch("https://accounts.spotify.com/api/token", payload);
  const response = await body.json();
  localStorage.setItem("spotify_access_token", response.access_token);
  currentToken = response.access_token;
  return response.access_token;
};

async function fetchProfile() {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${currentToken}` },
  });

  // TODO
  // if error clear storage and ?reload page?
  const results = await result.json();

  if (result.status == 200) {
    // check #s
    return results;
  } else {
    console.error(
      `Error getting user profile: ${result.status}: ${JSON.stringify(results)}`
    );
    // clear localstorage and reload page
    // alert(`An error occurred while trying to authenticate with Spotify.\n\nPlease try again.`);
    localStorage.clear();
    window.location.href = "/";
  }
}

async function fetchPlaylists() {
  const result = await fetch(
    "https://api.spotify.com/v1/me/playlists?limit=50",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${currentToken}` },
    }
  );

  return await result.json();
}

async function playPlaylist(uri) {
  const result = await fetch(
    "https://api.spotify.com/v1/me/player/play", //add device id (need to save it)
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${currentToken}` },
      body: JSON.stringify({
        context_uri: uri,
      }),
    }
  );

  return await result.json();
}

async function pausePlayback() {
  const result = await fetch(
    "https://api.spotify.com/v1/me/player/pause", //add device id (need to save it)
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${currentToken}` },
    }
  );

  const json = await result.json();
  return json;
}

async function switchPlaybackToLocalDevice(deviceId) {
  const result = await fetch(
    "https://api.spotify.com/v1/me/player", //add device id (need to save it)
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${currentToken}` },
      body: JSON.stringify({
        device_ids: [deviceId],
      }),
    }
  );

  return await result.json();
}

export {
  fetchPlaylists,
  fetchProfile,
  getToken,
  playPlaylist,
  pausePlayback,
  switchPlaybackToLocalDevice,
};
