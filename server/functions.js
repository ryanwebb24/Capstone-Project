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
  })


functions = {
    get_token: async(clientId, clientSecret) => {
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
    },
    sequelize

}

module.exports = functions