// const swaggerAutogen = require('swagger-autogen')();

// const doc = {
//   info: {
//     title: 'ATM Locator API',
//     description: 'API documentation for your ATM Locator backend',
//   },
//   host: 'localhost:3000',
//   basePath: '/api/atm_locator',
//   schemes: ['http'],
//   securityDefinitions: {
//     bearerAuth: {
//       type: 'http',
//       scheme: 'bearer',
//       bearerFormat: 'JWT',
//     },
//   },
//   definitions: {
//     RegisterUser: {
//       name: 'John Doe',
//       email: 'john@example.com',
//       password: 'password123',
//       role: 'customer',
//       gender: 'male',
//       address: '123 Main St',
//       dob: '1990-01-01',
//       phone: '1234567890',
//     },
//     LoginUser: {
//       email: 'john@example.com',
//       password: 'password123',
//     },
//     ATM: {
//       name: 'ATM 1',
//       bank: 'Bank 1',
//       slug: 'atm-1',
//       latitude: '27.123',
//       longitude: '85.123',
//       address: 'ATM Address',
//       phone: '1234567890',
//       status: 'active',
//       branch: ['branch-1'],
//     },
//     Bank: {
//       name: 'Bank 1',
//       slug: 'bank-1',
//       email: 'bank1@example.com',
//       latitude: '27.123',
//       longitude: '85.123',
//       address: 'Bank Address',
//       phone: 1234567890,
//       status: 'active',
//       branch: 'branch-1',
//       website: 'https://bank1.com',
//     },
//     Branch: {
//       name: 'Branch 1',
//       slug: 'branch-1',
//       latitude: '27.123',
//       longitude: '85.123',
//       bank: 'Bank 1',
//       services: ['service1', 'service2'],
//       address: 'Branch Address',
//       phone: '1234567890',
//       status: 'active',
//     },
//   },
// };

// const outputFile = './swagger_output.json';
// const endpointsFiles = [
//   './index.js',
//   './src/modules/auth/auth.router.js',
//   './src/modules/atm/atm.router.js',
//   './src/modules/bank/bank.router.js',
//   './src/modules/branch/branch.router.js',
// ];

// swaggerAutogen(outputFile, endpointsFiles, doc); 