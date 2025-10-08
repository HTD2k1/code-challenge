import { dbRun, dbGet, dbAll } from '../database/database';
import { User, CreateUserRequest, UpdateUserRequest, UserFilters } from '../types/User';

export class UserRepository {
  async create(userData: CreateUserRequest): Promise<User> {
    const { name, email, age } = userData;
    const now = new Date().toISOString();
    
    const result = await dbRun(
      'INSERT INTO users (name, email, age, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [name, email, age, now, now]
    );

    const newUser = await this.findById(result.lastID);
    if (!newUser) {
      throw new Error('Failed to create user');
    }

    return newUser;
  }

  async findById(id: number): Promise<User | null> {
    const user = await dbGet('SELECT * FROM users WHERE id = ?', [id]);
    return user ? this.mapRowToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    return user ? this.mapRowToUser(user) : null;
  }

  async findAll(filters: UserFilters = {}): Promise<{ users: User[]; total: number }> {
    const { name, email, minAge, maxAge, limit = 50, offset = 0 } = filters;
    
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (name) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${name}%`);
    }

    if (email) {
      whereClause += ' AND email LIKE ?';
      params.push(`%${email}%`);
    }

    if (minAge !== undefined) {
      whereClause += ' AND age >= ?';
      params.push(minAge);
    }

    if (maxAge !== undefined) {
      whereClause += ' AND age <= ?';
      params.push(maxAge);
    }

    // Get total count
    const countResult = await dbGet(`SELECT COUNT(*) as total FROM users ${whereClause}`, params);
    const total = countResult.total;

    // Get paginated results
    const users = await dbAll(
      `SELECT * FROM users ${whereClause} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      users: users.map(this.mapRowToUser),
      total
    };
  }

  async update(id: number, userData: UpdateUserRequest): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];

    if (userData.name !== undefined) {
      fields.push('name = ?');
      values.push(userData.name);
    }

    if (userData.email !== undefined) {
      fields.push('email = ?');
      values.push(userData.email);
    }

    if (userData.age !== undefined) {
      fields.push('age = ?');
      values.push(userData.age);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await dbRun(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await dbRun('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
  }

  private mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      age: row.age,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }
}
