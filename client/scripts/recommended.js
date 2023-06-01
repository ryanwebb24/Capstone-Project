const recommendedForm = document.querySelector("#recommended-form")
const recommendedTitle = document.querySelector("#track-name")
const recommendedArtist = document.querySelector("#artist-name")
const recommendedContainer = document.querySelector("#recommended-container")
const recommendedList = document.querySelector("#recommended-list")

recommendedForm.addEventListener("submit", event => {
    event.preventDefault()
    axios.get("/recommended", {
        params: {
            title: recommendedTitle.value,
            artist: recommendedArtist.value
        }
    })
    .then(res => {
        const recommendations = res.data
        for (let i in recommendations) {
            let {name, album, artists, external_urls, preview_url} = recommendations[i]
            let artistList = ""
            for (let j in artists){
                artistList += artists[j].name + " "
            }
            let li = document.createElement("li")
            li.classList.add("recommended-list-item")
            li.innerHTML = `
            <p>${name}</p>
            <p>${album.name}</p>
            <p>${artistList}</p>
            `
            li.innerHTML += `<a href="${external_urls.spotify}">Full song on spotify</a> `
            let btn = document.createElement("button")
            btn.classList.add("add-recommended-btn")
            btn.innerHTML = "Add to recommended playlist"
            li.appendChild(btn)
            btn.addEventListener("click", () => {
                let body = {
                    name,
                    artist: artists[0]
                }
                axios.post("/recommended", body)
                .then(res => {
                    li.removeChild(btn)
                    alert(res.data)
                })
                .catch(err => alert(err.response.data))
            })
            if (preview_url){
                let audioControls = document.createElement("audio")
                audioControls.classList.add("audio-controls")
                let audio = document.createElement("source")
                let playBtn = document.createElement("button")
                playBtn.classList.add("fa")
                playBtn.classList.add("fa-play")
                playBtn.classList.add("play-btn")
                playBtn.addEventListener("click", () => {
                    if(playBtn.classList.contains("fa-play")) {
                        playBtn.classList.remove("fa-play")
                        playBtn.classList.add("fa-pause")
                        audioControls.play()
                    } else {
                        playBtn.classList.remove("fa-pause")
                        playBtn.classList.add("fa-play")
                        audioControls.pause()
                    }
                })
                audio.src = preview_url
                audio.type = "audio/mp3"
                audioControls.appendChild(audio)
                li.appendChild(playBtn)
                li.appendChild(audioControls)  
            }
            recommendedList.appendChild(li)
        }
        let songAudio = document.querySelectorAll(".audio-controls")
        for (let i in songAudio) {
            songAudio[i].volume = 0.1
        }
    })
    .catch(err => alert(err.repsonse.data))
    recommendedArtist.value = ""
    recommendedTitle.value = ""
})