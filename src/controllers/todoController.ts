import { Response } from 'express';
import { validationResult } from 'express-validator';
import Todo from '../models/Todo';
import { AuthenticatedRequest, CreateTodoData, UpdateTodoData, ApiResponse, PaginatedResponse, PaginationQuery } from '../types';

export class TodoController {
  // Create a new todo
  public async createTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { title, description, priority, dueDate }: CreateTodoData = req.body;

      const todo = new Todo({
        title,
        description,
        priority: priority || 'medium',
        dueDate,
        userId: req.user.id,
      });

      await todo.save();

      const response: ApiResponse = {
        success: true,
        message: 'Todo created successfully',
        data: todo,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create todo error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while creating todo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get all todos for the authenticated user
  public async getTodos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        order = 'desc',
        completed,
        priority,
        search,
      } = req.query as PaginationQuery & {
        completed?: string;
        priority?: string;
        search?: string;
      };

      // Build filter object
      const filter: any = { userId: req.user.id };

      if (completed !== undefined) {
        filter.completed = completed === 'true';
      }

      if (priority) {
        filter.priority = priority;
      }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      // Calculate pagination
      const pageNum = Math.max(1, parseInt(page.toString(), 10));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit.toString(), 10)));
      const skip = (pageNum - 1) * limitNum;

      // Build sort object
      const sortOrder = order === 'asc' ? 1 : -1;
      const sortObj: any = {};
      sortObj[sort.toString()] = sortOrder;

      // Execute queries
      const [todos, total] = await Promise.all([
        Todo.find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Todo.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limitNum);

      const response: ApiResponse<PaginatedResponse<any>> = {
        success: true,
        message: 'Todos retrieved successfully',
        data: {
          data: todos,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: totalPages,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1,
          },
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get todos error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving todos',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get a specific todo by ID
  public async getTodoById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const { id } = req.params;

      const todo = await Todo.findOne({ _id: id, userId: req.user.id });

      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found',
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Todo retrieved successfully',
        data: todo,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get todo by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving todo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update a todo
  public async updateTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
        return;
      }

      const { id } = req.params;
      const updateData: UpdateTodoData = req.body;

      const todo = await Todo.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        updateData,
        { new: true, runValidators: true }
      );

      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found',
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Todo updated successfully',
        data: todo,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update todo error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating todo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Delete a todo
  public async deleteTodo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const { id } = req.params;

      const todo = await Todo.findOneAndDelete({ _id: id, userId: req.user.id });

      if (!todo) {
        res.status(404).json({
          success: false,
          message: 'Todo not found',
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Todo deleted successfully',
        data: { id: todo._id },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Delete todo error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while deleting todo',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get todo statistics
  public async getTodoStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const userId = req.user.id;

      const [
        totalTodos,
        completedTodos,
        pendingTodos,
        overdueTodos,
        highPriorityTodos,
        mediumPriorityTodos,
        lowPriorityTodos,
      ] = await Promise.all([
        Todo.countDocuments({ userId }),
        Todo.countDocuments({ userId, completed: true }),
        Todo.countDocuments({ userId, completed: false }),
        (Todo as any).findOverdue(userId).countDocuments(),
        Todo.countDocuments({ userId, priority: 'high' }),
        Todo.countDocuments({ userId, priority: 'medium' }),
        Todo.countDocuments({ userId, priority: 'low' }),
      ]);

      const stats = {
        total: totalTodos,
        completed: completedTodos,
        pending: pendingTodos,
        overdue: overdueTodos,
        completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
        priority: {
          high: highPriorityTodos,
          medium: mediumPriorityTodos,
          low: lowPriorityTodos,
        },
      };

      const response: ApiResponse = {
        success: true,
        message: 'Todo statistics retrieved successfully',
        data: stats,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get todo stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving todo statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

