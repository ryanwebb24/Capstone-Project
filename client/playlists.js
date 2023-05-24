const playlistForm = document.querySelector("#playlist-form")
const songTitle = document.querySelector("#song-title")
const songArtist = document.querySelector("#song-artist")
const songAlbum = document.querySelector("#song-album")

playlistForm.addEventListener("submit", event => {
    event.preventDefault()
    body = {
        songTitle: songTitle.value,
        songArtist: songArtist.value,
        songAlbum: songAlbum.value
    }
    console.log(body);
    axios.post("/playlist", body)
    .then(res => {
        console.log(res.data)
    })
    .catch(err => {
        console.log(err)
    })
})