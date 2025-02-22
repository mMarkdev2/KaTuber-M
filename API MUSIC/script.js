// YouTube API Key
const API_KEY = 'AIzaSyAb_lPngKiyBGxfXcfIHDhmo09XTlQxPsw'; 

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const karaokeButton = document.getElementById('karaoke-button');
const studyMusicButton = document.getElementById('study-music-button');
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
    fetchVideos(searchInput.value); // Fetch new results
});

studyMusicButton.addEventListener('click', () => {
    searchMode = 'study';
    searchInput.placeholder = "Search for music tutorials...";
    console.log("Mode: Study Music");
    fetchVideos(searchInput.value); // Fetch new results
});

// Trigger search on Enter key
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        console.log("Searching for:", searchInput.value);
        fetchVideos(searchInput.value);
    }
});

// Fetch YouTube Videos
function fetchVideos(query) {
    if (!query) return;
    
    let searchQuery = query;
    if (searchMode === 'karaoke') {
        searchQuery += " karaoke lyrics";  // Filters for karaoke
    } else if (searchMode === 'study') {
        searchQuery += " guitar tutorial OR piano tutorial OR how to play";  // Filters for tutorials
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
