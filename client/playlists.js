const songForm = document.querySelector("#song-form")
const songTitle = document.querySelector("#song-title")
const songArtist = document.querySelector("#song-artist")
const playlistForm = document.querySelector("#playlist-form")
const playlistName = document.querySelector("#playlist-name")
const playlistDropdown = document.querySelector("#playlist-selector")
const playlistContainer = document.querySelector("#playlist-container")

playlistForm.addEventListener("submit", event => {
    event.preventDefault()
    body = {
        name: playlistName.value
    }
    axios.post("/playlist", body)
    .then(res => {
        updateSelector()
        playlistName.value = ""
    })
    .catch(err => {
        console.log(err)
    }) 
})

function updateSelector() {
    playlistDropdown.innerHTML = '<option selected="selected" disabled>Select playlist</option>'
    axios.get("/playlist")
    .then( res => {
        if (res.data.length != 0){
            const playlists = res.data
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
}
function getPlaylist(event) {
    event.preventDefault()
    axios.get(`/playlist/${playlistDropdown.value}`)
    .then(res => {
        let playlistH2 = document.createElement("h2")
        playlistH2.textContent = "Playlist " + res.data[0].playlist_name + ":"
        playlistContainer.appendChild(playlistH2)
        for (let i in res.data){
            let songUl = document.createElement("ul")
            for (let j in res.data[i]){
                if (j !== "playlist_name"){
                    let li = document.createElement("li")
                    if (j !== "url") {
                        let songData = res.data[i][j]
                        li.innerHTML = `<p>${songData}</p>`
                        songUl.appendChild(li)
                    }else {
                        let songData = res.data[i][j]
                        li.innerHTML = `<a href= "${songData}">Listen here</a> `
                        songUl.appendChild(li) 
                    }
                }
            }
            playlistContainer.appendChild(songUl)
        }
    })
    .catch(err => {console.log(err)})
}

songForm.addEventListener("submit", event => {
    event.preventDefault()
    body = {
        songTitle: songTitle.value,
        songArtist: songArtist.value,
    }
    axios.post(`/playlist/${playlistDropdown.value}`, body)
    .then()
    .catch(err => {console.log(err)})
    songTitle.value = ""
    songArtist.value = ""
})
songForm.addEventListener("submit", getPlaylist)

updateSelector()
