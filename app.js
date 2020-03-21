const express = require('express');
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors')
const morgan = require('morgan')

const app = express()

mongoose.connect(process.env.MONGDB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

let db = mongoose.connection

db.once('open', function () {
    console.log('Database has connected')
})
db.once('error', function () {
    console.log('oops an error occurred')
})

app.use(cors())
app.use(morgan('combined'))

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))


app.listen(4000, function () {
    console.log('Listening on port 4000')
})

