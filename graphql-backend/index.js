const {
  ApolloServer,
  gql,
  UserInputError,
  AuthenticationError,
} = require("apollo-server");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
const MONGODB_URI =
  "mongodb+srv://fullstack:fullstack10@cluster0.zqibevf.mongodb.net/graphApp?retryWrites=true&w=majority";

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
  }
  type Mutation {
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const curAuthor = await Author.find({ name: args.author });
        return await Book.find({
          author: curAuthor,
          genres: { $in: [args.genre] },
        });
      }
      if (args.author) {
        const curAuthor = await Author.find({ name: args.author });
        return await Book.find({ author: curAuthor });
      }
      if (args.genre) {
        return await Book.find({ genres: { $in: [args.genre] } });
      }

      return Book.find({});
    },
    allAuthors: async (root, args) => {
      return Author.find({});
    },
  },
  Author: {
    name: (root) => root.name,
    born: (root) => root.born,
    id: (root) => root.id,
    bookCount: async (root) => {
      const curAuthor = await Author.findById(root.id);
      const bookNum = await Book.find({ author: curAuthor }).countDocuments();
      return bookNum;
    },
  },
  Book: {
    title: (root) => root.title,
    published: (root) => root.published,
    id: (root) => root.id,
    genres: (root) => root.genres,
    author: async (root) => await Author.findById(root.author),
  },
  Mutation: {
    addBook: async (root, args) => {
      const author = await Author.findOne({ name: args.author });
      let book;
      if (!author) {
        const newAuthor = new Author({
          name: args.author,
          born: null,
        });
        const authorRight = await newAuthor.save();
        book = new Book({ ...args, author: authorRight });
      } else {
        book = new Book({ ...args, author: author });
      }

      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      return book;
    },
    editAuthor: async (root, args) => {
      const authorToEdit = await Author.findOne({ name: args.name });
      if (!authorToEdit) {
        return null;
      }
      authorToEdit.born = args.setBornTo;

      try {
        await authorToEdit.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return authorToEdit.save();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
