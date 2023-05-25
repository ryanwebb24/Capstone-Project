const {sequelize, searchSong, getToken} = require("../functions")
const config = require("../config")

module.exports = {
    getPlaylist: (req, res) => {
        sequelize.query(`
            SELECT playlist_id AS id, name FROM playlists
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.log(err))
    },
    createPlaylist: (req, res) => {
        const {name} = req.body
        sequelize.query(`
            INSERT INTO playlists (name)
            VALUES ('${name}')
        `)
        .then(() => {
            res.status(200).send("Playlist Created!")
        })
        .catch(err => {
            console.log(err)
        })

    },
    updatePlaylist: async(req, res) => {
        const {songTitle, songArtist} = req.body
        const {id} = req.params
        const songData = await searchSong(songTitle, songArtist, await getToken(config.spotify.id, config.spotify.secret))
        let {name, artist, album, trackId, albumId, artistId, href, externalUrl, popularity} = songData
        name = name.replace("'", "")
        artist = artist.replace("'", "")
        album = album.replace("'","")
        sequelize.query(`
            INSERT INTO 
            tracks (track_id, name, artist_name, album_name, artist_id, album_id, href, external_url, popularity, playlist_id)
            VALUES ('${trackId}','${name}','${artist}','${album}','${albumId}','${artistId}','${href}','${externalUrl}','${popularity}',${id})
        `)
        .then(() => {
            res.status(200).send("Song Added!")
        })
        .catch(err => {
            console.log(err)
        })
        
    },
    deletePlaylist: () => {}
}