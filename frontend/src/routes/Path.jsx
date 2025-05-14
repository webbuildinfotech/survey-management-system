// src/routes/RoutePaths.js

export const RoutePaths = {
    HOME: "/",
    SERVICES: "/services",
    TECHNOLOGIES: "/technologies",
    INDUSTRIES: "/industries",
    PROJECTS: "/project",
    COMPANY: "/company",
    CONTACT: "/contact",

   // Technology Sub-Routes
   TECHNOLOGY: {
    FRONTEND: {
      REACT: "/technologies/react-info",
      VUE: "/technologies/vue-info",
      ANGULAR: "/technologies/angular-info",
      HTML5: "/technologies/html5-info",
    },
    BACKEND: {
      NODE: "/technologies/node-info",
      EXPRESS: "/technologies/express-info",
      GRAPHQL: "/technologies/graphql-info",
      NEST: "/technologies/nest-info",
    },
    DATABASE: {
      MONGO: "/technologies/mongo-info",
      FIREBASE: "/technologies/firebase-info",
      POSTGRES: "/technologies/postgres-info",
      MYSQL: "/technologies/mysql-info",
    },
  },
};
