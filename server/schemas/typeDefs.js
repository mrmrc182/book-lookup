const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me:  [User]
}
type Mutation {
    login(email, password):  Auth
    addUser(username, email, password):  Auth
    saveBook(authors, description, title, ):
    removeBook:
}
type User{
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: {Book}
}
type Book {
    bookId: Int
    authors: {String}
    description: String
    title: String
    image: IMAGE
    link: String
}
type Auth {
    token:
    user: [User]
}
`