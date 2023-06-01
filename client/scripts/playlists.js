const songForm = document.querySelector("#song-form")
const songTitle = document.querySelector("#song-title")
const songArtist = document.querySelector("#song-artist")
const playlistForm = document.querySelector("#playlist-form")
const playlistName = document.querySelector("#playlist-name")
const addSongPlaylistDropdown = document.querySelectorAll(".playlist-selector")[0]
const playlistViewDropdown = document.querySelectorAll(".playlist-selector")[1]
const playlistContainer = document.querySelector("#playlist-container")
const playlistBtn = document.querySelector("#playlist-btn")
const playlistViewForm = document.querySelector("#playlist-view-form")

function updateSelector(playlistDropdown) {
    playlistDropdown.innerHTML = '<option selected="selected" disabled>SELECT PLAYLIST</option>'
    axios.get("/playlist")
    .then( res => {
        if (res.data.length != 0){
            const playlists = res.data
            for (let i in playlists){
                if (playlistDropdown.id !== "song-selector" || playlists[i].name !== "recommended") {
                    let playlist = document.createElement("option")
                    playlist.id = "playlist-option"
                    playlist.value = playlists[i].id
                    playlist.textContent = playlists[i].name
                    playlistDropdown.appendChild(playlist)
                }    
            }
        } else {
            let playlist = document.createElement("option")
            playlist.id = "playlist-option"
            playlist.textContent = "No playlists"
            playlist.setAttribut("disabled", "")
            playlistDropdown.appendChild(playlist)
        }
    })
    .catch(err => alert(err.response.data))
}

function getPlaylist(playlistDropdown) {
    playlistContainer.innerHTML = ""
    axios.get(`/playlist/${playlistDropdown.value}`)
    .then(res => {
        if (res.data.length !== 0) {
            let playlistH2 = document.createElement("h3")
            playlistH2.textContent = "Playlist " + res.data[0].playlist_name + ":"
            playlistH2.id = "playlist-title"
            playlistContainer.appendChild(playlistH2)
            let section = document.createElement("section")
            section.id = "song-container"
            for (let i in res.data){
                let songUl = document.createElement("ul")
                songUl.classList.add("songs")
                let deleteBtn = document.createElement("button")
                deleteBtn.classList.add("song-btn")
                deleteBtn.innerHTML = "Delete song"
                for (let j in res.data[i]){
                    if (j !== "playlist_name" && j !== "id"){
                        let li = document.createElement("li")
                        li.classList.add("single-song")
                        if (j !== "url") {
                            let songData = res.data[i][j]
                            li.innerHTML = `<p>${songData}</p>`
                            songUl.appendChild(li)
                        }else {
                            let songData = res.data[i][j]
                            li.innerHTML = `<button class="song-btn"><a href= "${songData}">Listen here</a></button>`
                            songUl.appendChild(li) 
                        }
                    } else if (j === "id"){
                        let id = res.data[i][j]
                        deleteBtn.addEventListener("click", () => {
                            axios.delete(`/playlist/${id}`)
                            .then(res => {
                                getPlaylist(playlistViewDropdown)
                                alert(res.data)
                            })
                            .catch(err => alert(err.response.data))
                        })
                    }
                }
                songUl.appendChild(deleteBtn)
                section.appendChild(songUl)
            }
            playlistContainer.appendChild(section)
        } else {
            alert("Playlist is empty")
        }
    })
    .catch(err => alert(err.response.data))
}
playlistForm.addEventListener("submit", event => {
    event.preventDefault()
    body = {
        name: playlistName.value
    }
    axios.post("/playlist", body)
    .then(res => {
        alert(res.data)
        updateSelector(addSongPlaylistDropdown)
        updateSelector(playlistViewDropdown)
        playlistName.value = ""
    })
    .catch(err => {
        alert(err.response.data)
    }) 
})

songForm.addEventListener("submit", event => {
    event.preventDefault()
    body = {
        songTitle: songTitle.value,
        songArtist: songArtist.value,
    }
    axios.post(`/playlist/${addSongPlaylistDropdown.value}`, body)
    .then(res => {
        getPlaylist(addSongPlaylistDropdown)
        alert(res.data)
    })
    .catch(err => alert(err.response.data))
    songTitle.value = ""
    songArtist.value = ""
    
})
playlistViewForm.addEventListener("submit", event => {
    event.preventDefault()
    getPlaylist(playlistViewDropdown)
})
// need to fix how it doesnt add the most recent playlist

updateSelector(addSongPlaylistDropdown)
updateSelector(playlistViewDropdown)
