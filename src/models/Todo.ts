import mongoose, { Schema } from 'mongoose';
import { ITodo } from '../types';

const todoSchema = new Schema<ITodo>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    dueDate: {
      type: Date,
      validate: {
        validator: function (value: Date) {
          // Due date should be in the future or today
          return !value || value >= new Date(new Date().setHours(0, 0, 0, 0));
        },
        message: 'Due date cannot be in the past',
      },
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
todoSchema.index({ userId: 1 });
todoSchema.index({ completed: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ createdAt: -1 });

// Compound indexes
todoSchema.index({ userId: 1, completed: 1 });
todoSchema.index({ userId: 1, priority: 1 });
todoSchema.index({ userId: 1, dueDate: 1 });

// Static methods
todoSchema.statics.findByUserId = function (userId: string, filters: any = {}) {
  return this.find({ userId, ...filters });
};

todoSchema.statics.findCompletedByUserId = function (userId: string) {
  return this.find({ userId, completed: true });
};

todoSchema.statics.findPendingByUserId = function (userId: string) {
  return this.find({ userId, completed: false });
};

todoSchema.statics.findByPriority = function (userId: string, priority: string) {
  return this.find({ userId, priority });
};

todoSchema.statics.findOverdue = function (userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    userId,
    completed: false,
    dueDate: { $lt: today },
  });
};

// Instance methods
todoSchema.methods.markAsCompleted = function () {
  this.completed = true;
  return this.save();
};

todoSchema.methods.markAsPending = function () {
  this.completed = false;
  return this.save();
};

todoSchema.methods.isOverdue = function () {
  if (!this.dueDate || this.completed) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.dueDate < today;
};

const Todo = mongoose.model<ITodo>('Todo', todoSchema);

export default Todo;

