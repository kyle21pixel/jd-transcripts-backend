const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'JD Reporting Company API',
      version: '1.0.0',
      description: 'API documentation for JD Reporting Company transcription services',
      contact: {
        name: 'API Support',
        email: 'support@jdreporting.org',
        url: 'https://jd-reporting-company.netlify.app'
      }
    },
    servers: [
      {
        url: 'https://jd-transcripts-server-production.railway.app',
        description: 'Production server'
      },
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      }
    },
    security: [
      {
        cookieAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './models/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };