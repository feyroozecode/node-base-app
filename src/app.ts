import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config';
import Database from './config/database';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

// Import routes
import authRoutes from './routes/authRoutes';
import todoRoutes from './routes/todoRoutes';

class App {
  public app: Application;
  private database: Database;

  constructor() {
    this.app = express();
    this.database = Database.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.cors.origin === '*' ? true : config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Logging
    if (config.nodeEnv !== 'test') {
      this.app.use(morgan('combined'));
    }

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Trust proxy (for deployment behind reverse proxy)
    this.app.set('trust proxy', 1);
  }

  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv,
      });
    });

    // Swagger docs endpoint
    this.app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/todos', todoRoutes);

    // API documentation endpoint
    this.app.get('/api', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'API Documentation',
        version: '1.0.0',
        endpoints: {
          auth: {
            'POST /api/auth/register': 'Register a new user',
            'POST /api/auth/login': 'Login user',
            'GET /api/auth/profile': 'Get user profile (protected)',
            'PUT /api/auth/profile': 'Update user profile (protected)',
          },
          todos: {
            'POST /api/todos': 'Create a new todo (protected)',
            'GET /api/todos': 'Get all todos with pagination and filters (protected)',
            'GET /api/todos/stats': 'Get todo statistics (protected)',
            'GET /api/todos/:id': 'Get a specific todo (protected)',
            'PUT /api/todos/:id': 'Update a todo (protected)',
            'DELETE /api/todos/:id': 'Delete a todo (protected)',
          },
        },
      });
    });

    // 404 handler for undefined routes
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use((error: Error, req: Request, res: Response, next: NextFunction): void => {
      console.error('Global error handler:', error);

      // Mongoose validation error
      if (error.name === 'ValidationError') {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: Object.values((error as any).errors).map((err: any) => ({
            field: err.path,
            message: err.message,
          })),
        });
        return;
      }

      // Mongoose duplicate key error
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        const field = Object.keys((error as any).keyValue)[0];
        res.status(409).json({
          success: false,
          message: `${field} already exists`,
        });
        return;
      }

      // JWT errors
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
          success: false,
          message: 'Invalid token',
        });
        return;
      }

      if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          success: false,
          message: 'Token expired',
        });
        return;
      }

      // Cast error (invalid ObjectId)
      if (error.name === 'CastError') {
        res.status(400).json({
          success: false,
          message: 'Invalid ID format',
        });
        return;
      }

      // Default error
      res.status(500).json({
        success: false,
        message: config.nodeEnv === 'production' 
          ? 'Internal server error' 
          : error.message,
        ...(config.nodeEnv !== 'production' && { stack: error.stack }),
      });
    });
  }

  public async connectDatabase(): Promise<void> {
    await this.database.connect();
  }

  public async disconnectDatabase(): Promise<void> {
    await this.database.disconnect();
  }

  public listen(port: number): void {
    this.app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${port} in ${config.nodeEnv} mode`);
      console.log(`📚 API Documentation: http://localhost:${port}/api`);
      console.log(`❤️ Health Check: http://localhost:${port}/health`);
    });
  }
}

export default App;

