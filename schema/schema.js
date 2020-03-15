const graphql = require('graphql')
const Author = require('../models/author')
const Book = require('../models/book')

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql


// const books = [
//     { name: "Name of the wind", genre: "fantasy", id: 1, authorId: '1' },
//     { name: "Name of the sun", genre: "fantasy", id: 2, authorId: '2' },
//     { name: "Name of the moon", genre: "fantasy", id: 3, authorId: '3' },
//     { name: "Name of the sky", genre: "fantasy", id: 4, authorId: '3' },
//     { name: "Name of the earth", genre: "fantasy", id: 5, authorId: '3' }
// ]
// const authors = [
//     { name: "Arthur", age: 24, id: 1 },
//     { name: "Samson", age: 22, id: 2 },
//     { name: "David", age: 21, id: 3 }
// ]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // console.log(parent)
                // return authors.find(author => author.id == parent.authorId)
                return Author.findById(parent.authorId);
            }
        }
    })
})


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // console.log(parent)
                // let allBooks = books.filter(book => book.authorId == parent.id)
                // console.log(allBooks)
                // return allBooks
                return Book.find({ authorId: parent.id })
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get db/source
                // return books.find(book => book.id == args.id);
                return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                //code to get db/source
                // return authors.find(author => author.id == args.id);
                return Author.findById(args.id)
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({})
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors
                return Author.find({})
            }
        }
    })
})


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                })

                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save()
            }
        }
    })
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})