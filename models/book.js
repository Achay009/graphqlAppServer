const mongoose = require('mongoose')
const schema = mongoose.Schema

const bookSchema = new schema({
    name: String,
    authorId: String,
    genre: String
})

module.exports = mongoose.model('Book', bookSchema)