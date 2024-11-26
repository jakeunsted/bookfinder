import bcrypt from 'bcrypt';
import { User } from '../models/user.model.ts';
import { RefreshToken } from '../models/refreshToken.model.ts';

/**
 * get user by id
 * @param {number} id
 */
export async function getUserById(id: number): Promise<User | null> {
  const options = {
    attributes: {
      exclude: ['password']
    },
    raw: false
  };

  try {
    const user = await User.findByPk(id, options);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

/**
 * get users role by id
 * @param {number} id
 */
export async function getUserRoleById(id: number): Promise<string> {
  const options = {
    attributes: {
      exclude: ['password']
    },
    raw: false
  };

  try {
    const user = await User.findByPk(id, options);
    if (!user) {
      throw new Error('User not found');
    }
    return user.role;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

/**
 * Create a new user
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {string} role
 */
export async function createUser(
  username: string, 
  password: string, 
  email: string, 
  role: string
): Promise<User> {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role
    });
    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

/**
 * Delete a user by id
 * @param {number} id
 */
export async function deleteUserById(id: number): Promise<void> {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}

/**
 * Verify password for a user
 * @param {string} username
 * @param {string} password - unhashed password
 */
export async function verifyPassword(
  username: string, 
  password: string
): Promise<{ id: number, username: string, email: string, role: string }> {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const passwordResult = await bcrypt.compare(password, user.password);
    if (!passwordResult) {
      throw new Error('Invalid username or password');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error('Error verifying password:', error);
    throw new Error('Internal server error');
  }
}

/**
 * Create a refresh token in db
 * @param {number} userId 
 * @param {string} token 
 */
export async function createRefreshToken(
  userId: number, 
  token: string
): Promise<void> {
  const expiresAt = new Date(
    Date.now() + 6 * 30 * 24 * 60 * 60 * 1000
  ); // 6 months refresh token
  await RefreshToken.create({ userId, token, expiresAt });
}

/**
 * Finds a refresh token by its token value.
 * @param {string} token
 * @returns {Promise<RefreshToken | null>} - A promise that resolves to the 
 * found refresh token, or null if not found.
 */
export async function findRefreshToken(
  token: string
): Promise<RefreshToken | null> {
  const refreshToken = await RefreshToken.findOne({ where: { token } });
  return refreshToken;
}

/**
 * Deletes a refresh token from the database.
 * @param {string} token
 * @returns {Promise<void>} - A promise that resolves when the refresh token
 * is deleted.
 */
export async function deleteRefreshToken(token: string): Promise<void> {
  await RefreshToken.destroy({ where: { token } });
}
