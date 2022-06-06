// const express = require('express');
// const path = require('path');
// const { ApolloServer } = require('apollo-server-express');
// const {ApolloServerPluginDrainHttpServer} = require("apollo-server-core");
// const db = require('./config/connection');
// const routes = require('./routes');

// const { typeDefs, resolvers } = require('./schemas');

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });

// async function startApolloServer(typeDefs, resolvers) {
//   const app = express();
//   const httpServer = http.createServer(app);
//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//     csrfPrevention: true,
//     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   });
//   await server.start();
//   server.applyMiddleware({ app });
//   await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve));
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// }

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // add context
    introspection: true,
    context: authMiddleware,
  });
  await server.start();
  server.applyMiddleware({ app });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};
  
// Call the async function to start the server
startApolloServer(typeDefs, resolvers);