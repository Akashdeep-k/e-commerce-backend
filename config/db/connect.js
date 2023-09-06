const mongoose = require("mongoose")
const uri = process.env.DATABASE_URL

const dbConnect = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to database successfully")
    } catch (e) {
        console.error(e)
    }
}

module.exports = dbConnect