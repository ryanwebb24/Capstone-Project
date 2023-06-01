const config = require("./config")
// intializes sequelize
const Sequelize = require("sequelize")
const sequelize = new Sequelize(config.db.connection_str, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    logging: false
  })


functions = {
    getToken: async(clientId, clientSecret) => {
      try {
      const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": "Basic " + btoa(clientId + ":" + clientSecret)
        },
        body: "grant_type=client_credentials"
      })
      const data = await result.json()
      return data.access_token
      } catch (error) {
        console.log("error:" , error)
      }
    },
    sequelize,
    searchSong: async(name, artist, token) => {
        const result = await fetch(`https://api.spotify.com/v1/search?q=${name}%2520artist%3A${artist}&type=track`, {
          method: "GET",
          headers: {"Authorization": "Bearer " + token}
        })
        const data = await result.json()
        const song = data.tracks.items[0]
        return {
          trackId: song.id,
          name: song.name,
          artist: song.artists[0].name, 
          album: song.album.name,
          href: song.href,
          externalUrl: song.external_urls.spotify,
          artistId: song.artists[0].id,
          albumId: song.album.id,
          popularity: song.popularity,
          data: song
        }
    },
    sanitizeInput: (input) => {
      const blacklist = [';', '--', '/*', '*/', 'DROP', 'DELETE'];
      for (const item of blacklist) {
        if (input.includes(item)) {
          throw new Error('Invalid input detected.');
        }
      }
      return input;
    }
}

module.exports = functions