const jwt = require("jsonwebtoken")

const getRefreshAuthToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '1d'})
}

module.exports = getRefreshAuthToken