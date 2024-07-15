const User = require('../models/user.model');
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
    const user = User.findByPk(id, options);
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
    const user = User.findByPk(id, options);
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

    const user = User.create({
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
    const user = User.findByPk(id);
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
      throw new Error('Username is incorrect');
    }
    const passwordResult = await bcrypt.compare(password, user.password);
    if (!passwordResult) {
      throw new Error('Password is incorrect');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getUserById,
  getUserRoleById,
  createUser,
  deleteUserById,
  verifyPassword
}
