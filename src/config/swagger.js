const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen=require("swagger-autogen")();
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ATM Locator API',
      version: '1.0.0',
      description: 'API documentation for your ATM Locator backend',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        RegisterUser: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 250 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'customer', 'other'] },
            gender: { type: 'string', enum: ['male', 'female', 'others'] },
            address: { type: 'string' },
            dob: { type: 'string', format: 'date' },
            phone: { type: 'string' },
          },
          required: ['name', 'email', 'password', 'gender'],
        },
        LoginUser: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            gender: { type: 'string' },
            address: { type: 'string' },
            dob: { type: 'string', format: 'date' },
            phone: { type: 'string' },
            status: { type: 'string' },
            image: {
              type: 'object',
              properties: {
                publicId: { type: 'string' },
                url: { type: 'string' },
                thumbUrl: { type: 'string' },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        ATM: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            bank: { type: 'string' },
            slug: { type: 'string' },
            latitude: { type: 'string' },
            longitude: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            status: { type: 'string' },
            branch: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
        Bank: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            email: { type: 'string' },
            latitude: { type: 'string' },
            longitude: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'number' },
            status: { type: 'string' },
            branch: { type: 'string' },
            website: { type: 'string' },
          },
        },
        Branch: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            latitude: { type: 'string' },
            longitude: { type: 'string' },
            bank: { type: 'string' },
            services: {
              type: 'array',
              items: { type: 'string' },
            },
            address: { type: 'string' },
            phone: { type: 'string' },
            status: { type: 'string' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            message: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            message: { type: 'string' },
            read: { type: 'boolean' },
            user: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/atm_locator',
      },
    ],
  },
  apis: ['./src/modules/**/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };