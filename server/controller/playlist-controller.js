const {sequelize, searchSong, getToken, sanitizeInput} = require("../functions")
const config = require("../config")

module.exports = {
    getPlaylists: (req, res) => {
        sequelize.query(`
            SELECT playlist_id AS id, name FROM playlists
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.log(err))
    },
    createPlaylist: async (req, res) => {
        let {name} = req.body
        if (name.length !== 0 && name.length < 50) {
            name = sanitizeInput(name)
            try {
                await sequelize.query(`
                    INSERT INTO playlists (name)
                    VALUES ('${name}')
                `)
                res.status(200).send("Playlist Created!")
            } catch(err){
                console.log(err)
            }
        } else {
            res.status(400).send("Incorrect name formatting")
        }
        
    },
    updatePlaylist: async(req, res) => {
        let {songTitle, songArtist} = req.body
        let {id} = req.params
        if (songTitle.length !== 0 && songArtist.length !== 0) {
            songArtist = sanitizeInput(songArtist)
            songTitle = sanitizeInput(songTitle)
            id = sanitizeInput(id)
            let songData = await searchSong(songTitle, songArtist, await getToken(config.spotify.id, config.spotify.secret))
            let {name, artist, album, trackId, albumId, artistId, href, externalUrl, popularity} = songData
            name = name.replace("'", "")
            artist = artist.replace("'", "")
            album = album.replace("'","")
            let status = true
            await sequelize.query(`
                SELECT track_id
                From tracks
                WHERE playlist_id = ${id}
            `)
            .then(async (dbRes) => {
                for (let i in dbRes[0]){
                    if(dbRes[0][i].track_id === trackId){
                        status = false
                        break
                    }
                }
            })
            .catch(err => console.log(err))
            if (status) {
                try {
                    await sequelize.query(`
                    INSERT INTO tracks
                        (track_id, name, artist_name, album_name, artist_id, album_id, href, external_url, popularity, playlist_id)
                    VALUES
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, {
                    replacements: [
                        trackId, name, artist, album, albumId, artistId, href, externalUrl, popularity, id
                    ],
                    });
                    res.status(200).send("Song Added!");
                } catch (err) {
                    console.log(err);
                }
            } else {
                res.status(400).send("Song already exists")
            }
        } else {
            res.status(400).send("Incorrect input for song title and artist")
        }
        
    },
    getSinglePlaylist: async (req, res) => {
        let {id} = req.params
        id = sanitizeInput(id)
        if (id === "SELECT PLAYLIST") {
            res.status(400).send("Not a valid playlist")
        } else {
            try {
                const result = await sequelize.query(`
                    SELECT tracks.id, tracks.name, 
                    artist_name AS artist, 
                    album_name AS album, 
                    external_url AS url,
                    playlists.name AS playlist_name
                    FROM tracks
                    JOIN playlists
                    ON tracks.playlist_id = playlists.playlist_id
                    WHERE tracks.playlist_id = ${+id}
                `)
                res.status(200).send(result[0])
            }
            catch(err) {
                res.status(400).send("Invalid playlist")
                console.log(err)
            }
        }
    },
    deletePlaylist: async (req, res) => {
        let {id} = req.params
        id = sanitizeInput(id)
        try {
            await sequelize.query(`
                DELETE FROM tracks
                WHERE id = ${id}
            `)
            res.status(200).send("Deleted Song")
        } catch(err) {
            res.status(400).send("Invalid id")
            console.log(err)
        }
    }
}