const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
  }

  type Borrower {
    id: ID!
    name: String!
  }

  type Query {
    authors: [Author]
    books: [Book]
    borrowers: [Borrower]
  }

  type Mutation {
    createAuthor(name: String!): Author
    updateAuthor(id: ID!, name: String!): Author
    deleteAuthor(id: ID!): String
    createBook(title: String!, authorId: ID!): Book
    updateBook(id: ID!, title: String!, authorId: ID!): Book
    deleteBook(id: ID!): String
    createBorrower(name: String!): Borrower
    updateBorrower(id: ID!, name: String!): Borrower
    deleteBorrower(id: ID!): String
  }
`;

module.exports = typeDefs;
