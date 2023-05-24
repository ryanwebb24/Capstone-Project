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
    addSongToPlaylist: async(req, res) => {
        const {songTitle, songArtist, playlistId} = req.body
        const songData = await searchSong(songTitle, songArtist, await getToken(config.spotify.id, config.spotify.secret))
        let {name, artist, album, trackId, albumId, artistId, href, externalUrl, popularity} = songData
        name = name.replace("'", "")
        artist = artist.replace("'", "")
        album = album.replace("'","")
        sequelize.query(`
            INSERT INTO 
            tracks (id, name, artist_name, album_name, artist_id, album_id, href, external_url, popularity, playlist_id)
            VALUES ('${trackId}','${name}','${artist}','${album}','${albumId}','${artistId}','${href}','${externalUrl}','${popularity}',${playlistId})
        `)
        .then(() => {
            res.status(200).send("Playlist Created!")
        })
        .catch(err => {
            console.log(err)
        })
        
    },
    updatePlaylist: () => {},
    deletePlaylist: () => {}
}