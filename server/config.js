require("dotenv").config()

const {SERVER_PORT, DB_CONNECTION, SPOTIFY_ID, SPOTIFY_SECRET} = process.env

let config = {
    app: {
        port: SERVER_PORT
    },
    db: {
        connection_str: DB_CONNECTION
    },
    spotify: {
        id: SPOTIFY_ID,
        secret: SPOTIFY_SECRET
    }

}

module.exports = config