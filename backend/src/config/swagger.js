const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ExpenseAI API',
      version: '1.0.0',
      description: 'Production-grade Expense Tracker API with JWT Auth, OCR, Analytics, and Budget Tracking',
    },
    servers: [{ url: 'http://localhost:8000', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Expenses', description: 'Expense management' },
      { name: 'Analytics', description: 'Analytics and insights' },
      { name: 'Budget', description: 'Budget tracking' },
      { name: 'Import', description: 'CSV/PDF import' },
      { name: 'OCR', description: 'Receipt scanning' },
    ],
    paths: {
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'John Doe' },
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'Test@1234' },
                    role: { type: 'string', example: 'user' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'User registered successfully' },
            400: { description: 'Bad request' },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login user',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'john@example.com' },
                    password: { type: 'string', example: 'Test@1234' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Login successful' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout user',
          responses: { 200: { description: 'Logged out successfully' } },
        },
      },
      '/api/expenses': {
        get: {
          tags: ['Expenses'],
          summary: 'Get all expenses for current user',
          responses: { 200: { description: 'List of expenses' } },
        },
        post: {
          tags: ['Expenses'],
          summary: 'Create a new expense',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'amount', 'date'],
                  properties: {
                    title: { type: 'string', example: 'Lunch' },
                    amount: { type: 'number', example: 250 },
                    category: { type: 'string', example: 'food' },
                    date: { type: 'string', example: '2026-02-21' },
                    notes: { type: 'string', example: 'Team lunch' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Expense created successfully' },
            400: { description: 'Bad request' },
          },
        },
      },
      '/api/expenses/{id}': {
        get: {
          tags: ['Expenses'],
          summary: 'Get expense by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Expense found' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Expenses'],
          summary: 'Update expense',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Updated successfully' } },
        },
        delete: {
          tags: ['Expenses'],
          summary: 'Delete expense',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted successfully' } },
        },
      },
      '/api/analytics/stats': {
        get: {
          tags: ['Analytics'],
          summary: 'Get total stats (total, count, average)',
          responses: { 200: { description: 'Stats data' } },
        },
      },
      '/api/analytics/categories': {
        get: {
          tags: ['Analytics'],
          summary: 'Get spending by category',
          responses: { 200: { description: 'Category breakdown' } },
        },
      },
      '/api/analytics/monthly': {
        get: {
          tags: ['Analytics'],
          summary: 'Get monthly spending trends',
          responses: { 200: { description: 'Monthly trends' } },
        },
      },
      '/api/analytics/anomalies': {
        get: {
          tags: ['Analytics'],
          summary: 'Detect anomalous expenses using Z-score',
          responses: { 200: { description: 'Anomalies detected' } },
        },
      },
      '/api/budgets': {
        get: {
          tags: ['Budget'],
          summary: 'Get budgets for a month',
          parameters: [{ name: 'month', in: 'query', schema: { type: 'string', example: '2026-02' } }],
          responses: { 200: { description: 'Budget list with spending' } },
        },
        post: {
          tags: ['Budget'],
          summary: 'Set a monthly budget',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['category', 'monthlyLimit', 'month'],
                  properties: {
                    category: { type: 'string', example: 'food' },
                    monthlyLimit: { type: 'number', example: 5000 },
                    month: { type: 'string', example: '2026-02' },
                  },
                },
              },
            },
          },
          responses: { 201: { description: 'Budget set successfully' } },
        },
      },
      '/api/budgets/{id}': {
        delete: {
          tags: ['Budget'],
          summary: 'Delete a budget',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted successfully' } },
        },
      },
      '/api/import': {
        post: {
          tags: ['Import'],
          summary: 'Import expenses from CSV or PDF',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: { file: { type: 'string', format: 'binary' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Import successful' } },
        },
      },
      '/api/ocr/scan': {
        post: {
          tags: ['OCR'],
          summary: 'Scan receipt using AWS Textract OCR',
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: { receipt: { type: 'string', format: 'binary' } },
                },
              },
            },
          },
          responses: { 200: { description: 'Receipt scanned successfully' } },
        },
      },
    },
  },
  apis: [],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { background: #13131a; } .swagger-ui { background: #0a0a0f; color: #f0f0f5; }',
    customSiteTitle: 'ExpenseAI API Docs',
  }));
  console.log('Swagger docs available at http://localhost:8000/api-docs');
};

module.exports = { setupSwagger };