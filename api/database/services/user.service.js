const User = require('../models/user.model');
const RefreshToken = require('../models/refreshToken.model');
const bcrypt = require('bcrypt');

/**
 * get user by id
 * @param {number} id
 */
async function getUserById(id) {
  const options = {
    attributes: {
      exclude: ['password']
    },
    raw: false
  }
  
  try {
    const user = await User.findByPk(id, options);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    throw new Error(error);
  };
};

/**
 * get users role by id
 * @param {number} id
 */
async function getUserRoleById(id) {
  const options = {
    attributes: {
      exclude: ['password']
    },
    raw: false
  }

  try {
    const user = await User.findByPk(id, options);
    if (!user) {
      throw new Error('User not found');
    }
    return user.role;
  } catch (error) {
    throw new Error(error);
  };
}

/**
 * Create a new user
 * @param {string} username
 * @param {string} password
 * @param {string} email
 * @param {string} role
 */
async function createUser(username, password, email, role) {
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
    throw new Error(error);
  };
};

/**
 * Delete a user by id
 * @param {number} id
 */
async function deleteUserById(id) {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    await user.destroy();
  } catch (error) {
    throw new Error(error);
  };
};

/**
 * Verify password for a user
 * @param {string} username
 * @param {string} password - unhashed password
 */
async function verifyPassword(username, password) {
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
 * @param {String} userId 
 * @param {String} token 
 */
async function createRefreshToken(userId, token) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours refresh token
  await RefreshToken.create({ userId, token, expiresAt });
}

/**
 * Finds a refresh token by its token value.
 * @param {string} token
 * @returns {Promise<RefreshToken|null>} - A promise that resolves to the found refresh token, or null if not found.
 */
async function findRefreshToken(token) {
  const refreshToken = await RefreshToken.findOne({ where: { token } });
  return refreshToken;
}

/**
 * Deletes a refresh token from the database.
 * @param {string} token
 * @returns {Promise<void>} - A promise that resolves when the refresh token is deleted.
 */
async function deleteRefreshToken(token) {
  await RefreshToken.destroy({ where: { token } });
}

module.exports = {
  getUserById,
  getUserRoleById,
  createUser,
  deleteUserById,
  verifyPassword,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken
}
