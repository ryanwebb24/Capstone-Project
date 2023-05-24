const {sequelize} = require("../functions")

module.exports = {
    getPlaylist: () => {},
    addPlaylist: (req, res) => {
        const {songTitle, songArtist, songAlbum} = req.body
        sequelize.query(`
            INSERT INTO artist (name)
            VALUES ('${songArtist}')
            ON CONFLICT (name) DO NOTHING;
        
            INSERT INTO album (name)
            VALUES ('${songAlbum}')
            ON CONFLICT (name) DO NOTHING;
        
            INSERT INTO tracks (name, artist_id, album_id)
            SELECT '${songTitle}', artist.artist_id, album.album_id
            FROM artist
            JOIN album ON album.name = '${songAlbum}'
            WHERE artist.name = '${songArtist}';
        `)
        .then(dbRes => {
            console.log(dbRes)
        })
        .catch(err => {
            console.log(err)
        })
        res.status(200).send("Playlist Created!")
    },
    updatePlaylist: () => {},
    deletePlaylist: () => {}
}