import { UserRepository } from '../repositories/UserRepository';
import { User, CreateUserRequest, UpdateUserRequest, UserFilters } from '../types/User';
import { ApiResponse, PaginatedResponse } from '../types/ApiResponse';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      // Check if email already exists
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      const user = await this.userRepository.create(userData);
      return {
        success: true,
        data: user,
        message: 'User created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user'
      };
    }
  }

  async getUsers(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    try {
      const { users, total } = await this.userRepository.findAll(filters);
      const { limit = 50, offset = 0 } = filters;

      return {
        success: true,
        data: users,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get users',
        pagination: {
          total: 0,
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          hasMore: false
        }
      };
    }
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Check if email is being updated and if it already exists
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await this.userRepository.findByEmail(userData.email);
        if (emailExists) {
          return {
            success: false,
            error: 'User with this email already exists'
          };
        }
      }

      const updatedUser = await this.userRepository.update(id, userData);
      if (!updatedUser) {
        return {
          success: false,
          error: 'Failed to update user'
        };
      }

      return {
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      };
    }
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
      const deleted = await this.userRepository.delete(id);
      if (!deleted) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  }
}
