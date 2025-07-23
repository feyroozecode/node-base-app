import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Boilerplate API',
      version: '1.0.0',
      description: 'API documentation for the Node.js Boilerplate project',
    },
    servers: [
      {
        url: 'http://localhost:3000/',
      },
    ],
  },
  apis: [
    './src/routes/*.ts', // Path to your route files
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;