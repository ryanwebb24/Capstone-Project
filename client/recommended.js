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
            let {name, album, artists, external_urls, popularity, preview_url} = recommendations[i]
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
            <p>${popularity}</p>
            `
            if (preview_url){
                li.innerHTML += `
                <a class="preview">Preview song</a>
                <audio controls>
                    <source src="${preview_url}" type="audio/mp3">
                    Your browser does not support the audio element.
                </audio> 
                `
            }
            li.innerHTML += `<a href="${external_urls.spotify}">Full song on spotify</a> `
            let btn = document.createElement("button")
            btn.classList.add("recommended-btn")
            btn.innerHTML = "Add to recommended playlist"
            li.appendChild(btn)
            btn.addEventListener("click", () => {
                let body = {
                    name,
                    artist: artists[0]
                }
                console.log("test");
                console.log(body);
                axios.post("/recommended", body)
                .then(res => alert(res.data))
                .catch(err => console.log(err))
            })
            recommendedList.appendChild(li)
        }
    })
    .catch(err => console.log(err))
})