const jwt = require("jsonwebtoken")

const getRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET)
}

module.exports = getRefreshToken