const typeDefs = `
type Book {
    bookId: ID!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
}

type User {
    _id: ID!
    username: String!
    email:  String!
    bookCount: Int!
    savedBooks: [Book]
}

type Auth {
    token: String!
    user: User
}

input BookInput {
    authors: [String]
    description: String!
    title: String!
    bookId: ID!
    image: String
    link: String
}

type Query {
    me: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput!): User
    removeBook(bookId: ID!): User
}
`

module.exports = typeDefs;