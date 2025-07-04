const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATM Locator API',
      version: '1.0.0',
      description: 'API documentation for your ATM Locator backend',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/atm_locator',
      },
    ],
  },
  apis: ['./src/modules/**/*.js'], // Path to the API docs in your code
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };