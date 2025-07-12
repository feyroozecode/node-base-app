import { Router } from 'express';
import { TodoController } from '../controllers/todoController';
import { authenticate } from '../middleware/auth';
import {
  createTodoValidator,
  updateTodoValidator,
  todoIdValidator,
  todoQueryValidator,
} from '../middleware/validators';

const router = Router();
const todoController = new TodoController();

// All todo routes require authentication
router.use(authenticate);

// Todo CRUD routes
router.post('/', createTodoValidator, todoController.createTodo);
router.get('/', todoQueryValidator, todoController.getTodos);
router.get('/stats', todoController.getTodoStats);
router.get('/:id', todoIdValidator, todoController.getTodoById);
router.put('/:id', todoIdValidator, updateTodoValidator, todoController.updateTodo);
router.delete('/:id', todoIdValidator, todoController.deleteTodo);

export default router;

