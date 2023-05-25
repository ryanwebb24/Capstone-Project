const config = require("./config")
const express = require("express")
const path = require("path")
const app = express()


const {getPlaylists, createPlaylist, updatePlaylist, deletePlaylist, getSinglePlaylist} = require("./controller/playlist-controller")
const {getRecommended, updateRecommended} = require("./controller/recommended-controller")




app.use(express.json())
app.use(express.static(path.join(process.cwd() + "/client")))

// playlist end-points
app.get("/playlist", getPlaylists)
app.post("/playlist", createPlaylist)
app.post("/playlist/:id", updatePlaylist)
app.get("/playlist/:id", getSinglePlaylist)
// app.delete("playlis/:id", deletePlaylist)
// recommended end-points
// app.get("/recommended", getRecommended)
// app.post("/recommended", addRecommended)

app.listen(config.app.port, () => {console.log(`Server running on port ${config.app.port}`)})