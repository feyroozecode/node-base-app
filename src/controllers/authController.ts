import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User';
import { AuthenticatedRequest, LoginCredentials, RegisterData, AuthResponse, ApiResponse } from '../types';

export class AuthController {
  // Register a new user
  public async register(req: Request, res: Response): Promise<void> {
    try {
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

      const { email, password, firstName, lastName }: RegisterData = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: 'User with this email already exists',
        });
        return;
      }

      // Create new user
      const user = new User({
        email,
        password,
        firstName,
        lastName,
      });

      await user.save();

      // Generate token
      const token = user.generateAuthToken();

      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          token,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Login user
  public async login(req: Request, res: Response): Promise<void> {
    try {
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

      const { email, password }: LoginCredentials = req.body;

      // Find user and check password
      const user = await (User as any).findByCredentials(email, password);

      // Generate token
      const token = user.generateAuthToken();

      const response: ApiResponse<AuthResponse> = {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          token,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error && error.message === 'Invalid login credentials') {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error during login',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get current user profile
  public async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
        return;
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while retrieving profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Update user profile
  public async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const { firstName, lastName } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { firstName, lastName },
        { new: true, runValidators: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          updatedAt: user.updatedAt,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while updating profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

