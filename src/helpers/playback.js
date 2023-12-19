const embedplaybacksdk = () => {
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js"; // Replace with the actual path to the SDK file
  document.head.appendChild(script); // Or use document.body.appendChild(script);
};

export { embedplaybacksdk };
