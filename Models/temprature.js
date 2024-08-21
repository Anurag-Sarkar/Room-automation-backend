const mongoose = require("mongoose")

const tempSchema = mongoose.Schema({
    temperature:[String]
})

module.exports = mongoose.model("models",tempSchema)