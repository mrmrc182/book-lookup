const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Query {
    me:  [User]
}
type Mutation {
    login(email: String!, password: String!):  Auth
    addUser(username: String!, email: String!, password: String!):  Auth
    saveBook(authors, description, title, ):
    removeBook:
}
type User{
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}
type Book {
    bookId: Int
    authors: [String]
    description: String
    title: String
    image: IMAGE
    link: String
}
input savedBook {
    description: String
    title: String
    bookId: String
    image: String
    link: String
    authors: [String]
}
type Auth {
    token: ID!
    user: User
}
`