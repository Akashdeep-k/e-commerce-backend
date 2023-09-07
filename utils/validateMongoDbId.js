const mongoose = require("mongoose")

const isValidMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if (!isValid) {
        throw new Error("Not a valid mongodb Id")
    }
}

module.exports = isValidMongoDbId