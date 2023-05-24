const songForm = document.querySelector("#song-form")
const songTitle = document.querySelector("#song-title")
const songArtist = document.querySelector("#song-artist")
const playlistForm = document.querySelector("#playlist-form")
const playlistName = document.querySelector("#playlist-name")
const playlistDropdown = document.querySelector("#playlist-selector")

playlistForm.addEventListener("submit", event => {
    event.preventDefault()
    body = {
        name: playlistName.value
    }
    axios.post("/playlist", body)
    .then(res => {
        alert(res.data)
    })
    .catch(err => {
        console.log(err)
    })
})

playlistDropdown.addEventListener("click", () => {
    axios.get("/playlist")
    .then( res => {
        if (res.data.length != 0){
            const playlists = res.data
            playlistDropdown.innerHTML = ""
            for (let i in playlists){
                let playlist = document.createElement("option")
                playlist.id = "playlist-option"
                playlist.value = playlists[i].id
                playlist.textContent = playlists[i].name
                playlistDropdown.appendChild(playlist)
            }
        } else {
            let playlist = document.createElement("option")
            playlist.id = "playlist-option"
            playlist.textContent = "No playlists"
            playlist.setAttribut("disabled", "")
            playlistDropdown.appendChild(playlist)
        }
    })
    .catch(err => console.log(err))
})

songForm.addEventListener("submit", event => {
    event.preventDefault()
    body = {
        songTitle: songTitle.value,
        songArtist: songArtist.value,
        playlistId: playlistDropdown.value
    }
    axios.post("/playlist", body)
    .then(res => {alert(res.data)})
    .catch(err => {console.log(err)})
    songTitle.value = ""
    songArtist.value = ""
})