import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '../config';

// Determine the base URL based on environment
const getBaseUrl = () => {
  // Railway deployment
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }
  // Development
  return `http://localhost:${config.port}`;
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpressJS CRUD API',
      version: '1.0.0',
      description: 'A comprehensive CRUD API built with ExpressJS, TypeScript, and Zod validation',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: getBaseUrl(),
        description: config.nodeEnv === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'age'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 100,
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            age: {
              type: 'integer',
              description: 'User age',
              minimum: 1,
              maximum: 150,
              example: 30,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
              example: '2024-01-01T00:00:00.000Z',
            },
          },
        },
        CreateUserRequest: {
          type: 'object',
          required: ['name', 'email', 'age'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 100,
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john@example.com',
            },
            age: {
              type: 'integer',
              description: 'User age',
              minimum: 1,
              maximum: 150,
              example: 30,
            },
          },
        },
        UpdateUserRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              minLength: 2,
              maxLength: 100,
              example: 'John Smith',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.smith@example.com',
            },
            age: {
              type: 'integer',
              description: 'User age',
              minimum: 1,
              maximum: 150,
              example: 31,
            },
          },
        },
        UserFilters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Filter by name (partial match)',
              example: 'John',
            },
            email: {
              type: 'string',
              description: 'Filter by email (partial match)',
              example: 'example.com',
            },
            minAge: {
              type: 'integer',
              description: 'Minimum age filter',
              minimum: 1,
              example: 25,
            },
            maxAge: {
              type: 'integer',
              description: 'Maximum age filter',
              maximum: 150,
              example: 65,
            },
            limit: {
              type: 'integer',
              description: 'Number of results per page',
              minimum: 1,
              maximum: 100,
              default: 50,
              example: 20,
            },
            offset: {
              type: 'integer',
              description: 'Number of results to skip',
              minimum: 0,
              default: 0,
              example: 0,
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indicates if the request was successful',
              example: true,
            },
            data: {
              description: 'Response data (varies by endpoint)',
            },
            message: {
              type: 'string',
              description: 'Success message',
              example: 'User created successfully',
            },
            error: {
              type: 'string',
              description: 'Error message',
              example: 'User not found',
            },
            details: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Validation error details',
              example: ['Name must be at least 2 characters long'],
            },
          },
        },
        PaginatedResponse: {
          allOf: [
            {
              $ref: '#/components/schemas/ApiResponse',
            },
            {
              type: 'object',
              properties: {
                data: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/User',
                  },
                },
                pagination: {
                  type: 'object',
                  properties: {
                    total: {
                      type: 'integer',
                      description: 'Total number of items',
                      example: 100,
                    },
                    limit: {
                      type: 'integer',
                      description: 'Number of items per page',
                      example: 50,
                    },
                    offset: {
                      type: 'integer',
                      description: 'Number of items skipped',
                      example: 0,
                    },
                    hasMore: {
                      type: 'boolean',
                      description: 'Whether there are more items available',
                      example: true,
                    },
                  },
                },
              },
            },
          ],
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Validation error',
            },
            details: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Name must be at least 2 characters long', 'Please provide a valid email address'],
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

export const swaggerSpec = swaggerJsdoc(options);
