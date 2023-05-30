const config = require("../config")
const {getToken, searchSong} = require("../functions")
const {sequelize} = require("../functions")
const axios = require("axios")
module.exports = {
    getRecommended: async(req, res) => {
        const {title, artist} = req.query
        if (title.length !== 0 && artist.length !== 0) {
            let {trackId, artistId} = await searchSong(title, artist, await getToken(config.spotify.id, config.spotify.secret))
            axios.get(`https://api.spotify.com/v1/recommendations?seed_artists=${artistId}&seed_tracks=${trackId}`, {
            headers: {"Authorization": "Bearer " + await getToken(config.spotify.id, config.spotify.secret)}
            })
            .then(apiRes => {
                const recommendations = apiRes.data.tracks
                res.status(200).send(recommendations)
            })
            .catch(err => console.log(err)) 
        } else {
            res.status(400).send("inccorect input for title and artist")
        }
    },
    addRecommended: async (req, res) => {
        const {name: title, artist: searchArtist} = req.body
        if (title.length !== 0 && searchArtist.length !== 0) {
            let {name, artist, album, trackId, albumId, artistId, href, externalUrl, popularity} = await searchSong(title, searchArtist, await getToken(config.spotify.id, config.spotify.secret))
            name = name.replace("'", "")
            artist = artist.replace("'", "")
            album = album.replace("'","")
            try {
                await sequelize.query(`
                INSERT INTO tracks
                    (track_id, name, artist_name, album_name, artist_id, album_id, href, external_url, popularity, playlist_id)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, 18)
                `, {
                replacements: [
                    trackId, name, artist, album, albumId, artistId, href, externalUrl, popularity
                ],
                });
                res.status(200).send("Song Added to Recommended!");
            } catch (err) {
                console.log(err);
            }
        } else {
            res.status(400).send("Incorrect input for title and artist")
        }  
    }
    
}