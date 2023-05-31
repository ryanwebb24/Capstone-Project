const soundHolder1 = document.querySelector("#sound-holder1")
const soundHolder2 = document.querySelector("#sound-holder2")

function soundBar(soundHolder) {
    for (let i = 1; i <= 121; i++){
        let randInt = Math.floor((Math.random() * 6) + 1)
        let bar = document.createElement("div")
        bar.classList.add("bar")
        bar.classList.add(`fill${randInt}`)
        soundHolder.appendChild(bar)
    }
}


soundBar(soundHolder1)
soundBar(soundHolder2)