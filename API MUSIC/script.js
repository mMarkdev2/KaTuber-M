// YouTube API Key
const API_KEY = 'AIzaSyAb_lPngKiyBGxfXcfIHDhmo09XTlQxPsw'; 

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const karaokeButton = document.getElementById('karaoke-button');
const studyMusicButton = document.getElementById('study-music-button');
const timeDisplay = document.getElementById('time-display'); // 📌 Time display
let player;
let searchMode = 'karaoke'; // Default mode

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// YouTube Player Ready
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        playerVars: { 'autoplay': 0, 'controls': 1 },
        events: { 'onError': onPlayerError }
    });
}

// Handle Video Errors
function onPlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    alert('Error playing video.');
}

// Update search mode
karaokeButton.addEventListener('click', () => {
    searchMode = 'karaoke';
    searchInput.placeholder = "Search for karaoke songs...";
    console.log("Mode: Karaoke");
    fetchVideos(searchInput.value);
});

studyMusicButton.addEventListener('click', () => {
    searchMode = 'study';
    searchInput.placeholder = "Search for music tutorials...";
    console.log("Mode: Study Music");
    fetchVideos(searchInput.value);
});

// Fetch YouTube Videos
function fetchVideos(query) {
    if (!query) return;
    
    let searchQuery = query;
    if (searchMode === 'karaoke') {
        searchQuery += " karaoke lyrics";  
    } else if (searchMode === 'study') {
        searchQuery += " guitar tutorial OR piano tutorial OR how to play";  
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}&type=video&videoEmbeddable=true`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data);
            displayResults(data.items);
        })
        .catch(error => console.error('Error fetching videos:', error));
}

// Display Search Results
function displayResults(videos) {
    searchResults.innerHTML = '';
    if (videos.length === 0) {
        searchResults.innerHTML = "<p>No results found.</p>";
        return;
    }
    
    videos.forEach(video => {
        const videoDiv = document.createElement('div');
        videoDiv.innerHTML = `
            <h3>${video.snippet.title}</h3>
            <button onclick="playVideo('${video.id.videoId}')">Play</button>
        `;
        searchResults.appendChild(videoDiv);
    });
}

// Play Selected Video
function playVideo(videoId) {
    if (videoId) {
        player.loadVideoById(videoId);
    } else {
        alert('Video unavailable.');
    }
}

// Function to update the time every second
function updateClock(initialDateTime) {
    let currentTime = new Date(initialDateTime); // Convert API datetime to JS Date object

    function tick() {
        currentTime.setSeconds(currentTime.getSeconds() + 1); // Add 1 second
        const formattedTime = currentTime.toLocaleTimeString("en-PH", { 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit",
            hour12: true 
        }); 

        document.getElementById("time-display").textContent = 
            `PH Time: ${formattedTime} | Karaoke Curfew: 10PM`;
    }

    tick(); // Run immediately
    setInterval(tick, 1000); // Update every second
}

// Run the function on page load
window.onload = fetchTime;
