const config = require("../config")
const {get_token} = require("../functions")
module.exports = {
    getRecommended: () => {
        console.log(config.spotify.id, config.spotify.secret)
    },
    updateRecommended: () => {}
}